import { spawn, spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";

import { fileURLToPath } from "node:url";

// Is there an official way to get the path to another packages binary?
const __dirname = dirname(fileURLToPath(import.meta.url));
const dendriteBinPath = resolve(
  __dirname,
  "../",
  `dendrite-dist-${process.platform}-${process.arch}`,
  'dist',
  /^win/.test(process.platform) ? "dendrite.exe" : "dendrite",
);
const generateKeysBinPath = resolve(
  __dirname,
  "../",
  `dendrite-dist-${process.platform}-${process.arch}`,
  'dist',
  /^win/.test(process.platform) ? "generate-keys.exe" : "generate-keys",
);
const createAccountBinPath = resolve(
  __dirname,
  "../",
  `dendrite-dist-${process.platform}-${process.arch}`,
  'dist',
  /^win/.test(process.platform) ? "create-account.exe" : "create-account",
);
const resolveStateBinPath = resolve(
  __dirname,
  "../",
  `dendrite-dist-${process.platform}-${process.arch}`,
  'dist',
  /^win/.test(process.platform) ? "resolve-state.exe" : "resolve-state",
);

const exists = async (path) => {
  try {
    const fileInfo = await stat(path);
    if (!fileInfo.isFile() && !fileInfo.isDirectory()) { return false }
    return true;
  } catch (_e) {
    return false;
  }
};

export const createUser = (username, password) => {
  const accountProc = spawnSync(createAccountBinPath, ['--config', 'dendrite.yaml', '--username', username, '--password', password])
  console.log(accountProc?.stdout?.toString())
  console.error(accountProc?.stderr?.toString())
}

export const init = () => {
  const privKeyProc = spawnSync(generateKeysBinPath, ['--private-key', 'matrix_key.pem'])
  console.log(privKeyProc?.stdout?.toString())
  console.error(privKeyProc?.stderr?.toString())
  const tlsProc = spawnSync(generateKeysBinPath, ['--tls-cert', 'server.crt', '--tls-key', 'server.key'])
  console.log(tlsProc?.stdout?.toString())
  console.error(tlsProc?.stderr?.toString())
}

export default async () => {
  const proc = await new Promise((pResolve, reject) => {
    const proc = spawn(
      dendriteBinPath,
      ['--tls-cert', 'server.crt', '--tls-key', 'server.key', '--config', 'dendrite.yaml'],
    );
    proc.stderr?.on('data', (chunk) => {
      const message = chunk.toString('utf-8');
      console.error(message);
    });
    proc.stdout?.on('data', (chunk) => {
      const message = chunk.toString('utf-8');
      console.log(message);
      if (message.includes('Starting external listener')) {
        pResolve(proc);
      }
    });
    proc.on("close", (code) => {
      console.warn("dendriteShutdown", code);
    });
  });

  return {
    proc,
    stop: async () => {
      proc.stdout.destroy();
      proc.stderr.destroy();
      proc.kill("SIGKILL");
    },
  };
};

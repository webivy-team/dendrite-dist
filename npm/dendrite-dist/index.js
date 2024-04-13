import { spawn, spawnSync } from "node:child_process";
import { stat, readFile, unlink } from "node:fs/promises";
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

// TODO: When running on a unix socket this needs to be passed a --url, probably with the reverse proxy url
export const createUser = (args) => {
  const accountProc = spawnSync(createAccountBinPath, args)
  console.log(accountProc?.stdout?.toString())
  console.error(accountProc?.stderr?.toString())
}

export const initMatrixKey = async () => {
  const privKeyProc = spawnSync(generateKeysBinPath, ['--private-key', '._tmp_matrix_key.pem'])
  console.log(privKeyProc?.stdout?.toString())
  console.error(privKeyProc?.stderr?.toString())
  const key = await readFile('._tmp_matrix_key.pem', {encoding: 'utf8'})
  await unlink('._tmp_matrix_key.pem')
  return key
}

export const initTLSKey = async () => {
  const tlsProc = spawnSync(generateKeysBinPath, ['--tls-cert', '._tmp_server.crt', '--tls-key', '._tmp_server.pem'])
  const key = await readFile('._tmp_server.pem', {encoding: 'utf8'})
  const crt = await readFile('._tmp_server.crt', {encoding: 'utf8'})
  await unlink('._tmp_server.pem')
  await unlink('._tmp_server.crt')
  console.log(tlsProc?.stdout?.toString())
  console.error(tlsProc?.stderr?.toString())
  return {key, crt}
}

export default async (args = ['--config', 'dendrite.yaml', '--tls-cert', 'server.crt', '--tls-key', 'server.pem']) => {
  const proc = await new Promise((pResolve, reject) => {
    const proc = spawn(
      dendriteBinPath,
      args,
    );
    proc.stderr?.on('data', (chunk) => {
      const message = chunk.toString('utf-8');
      console.error(message);
    });
    proc.stdout?.on('data', (chunk) => {
      const message = chunk.toString('utf-8');
      console.log(message);
      // TODO: This relies on dendrite having info logging
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

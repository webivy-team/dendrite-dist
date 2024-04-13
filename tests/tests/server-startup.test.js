import assert from "node:assert";
import test from "node:test";
import { writeFile } from "node:fs/promises";

import dendrite, {initMatrixKey, initTLSKey, createUser} from "dendrite-dist"

test("Server startup", async () => {
  // This will create keys
  const matrixKey = await initMatrixKey()
  await writeFile('matrix_key.pem', matrixKey)

  const {key, crt} = await initTLSKey()
  await writeFile('server.crt', crt)
  await writeFile('server.pem', key)

  // Then start the server
  const server = await dendrite()
  await createUser(['--config', 'dendrite.yaml', '--username', 'testuser', '--password', 'testpassword'])
  const res = await fetch('http://localhost:8008/_matrix/static/').then(r => r.text())
  assert(res.includes('It works! Dendrite'))
  server.stop();
})

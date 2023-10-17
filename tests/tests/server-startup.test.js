import assert from "node:assert";
import test from "node:test";

import dendrite, {init, createUser} from "dendrite-dist"

test("Server startup", async () => {
  // This will create keys
  await init()
  // Then start the server
  const server = await dendrite()
  await createUser('testuser', 'testpassword')
  const res = await fetch('http://localhost:8008/_matrix/static/').then(r => r.text())
  assert(res.includes('It works! Dendrite'))
  server.stop();
})

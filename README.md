# dendrite-dist

Use [dendrite](https://matrix-org.github.io/dendrite/) as an npm module for tighter integration with node apps (e.g. test fixtures). See the dendrite documentation for usage: https://matrix-org.github.io/dendrite/.

## Usage

`npm install dendrite-dist`

Put a `dendrite.yaml` in the current working directory.

```javascript
import dendrite, {initMatrixKey, initTLSKey, createUser} from "dendrite-dist"

// This will create keys
const matrixKey = await initMatrixKey()
await writeFile('matrix_key.pem', matrixKey)

const {key, crt} = await initTLSKey()
await writeFile('server.crt', crt)
await writeFile('server.key', key)

// Then start the server
const server = await dendrite()
await createUser(['--config', 'dendrite.yaml', '--username', 'testuser', '--password', 'testpassword'])
server.stop()
```

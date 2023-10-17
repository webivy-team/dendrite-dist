# dendrite-dist

Use [dendrite](https://matrix-org.github.io/dendrite/) as an npm module for tighter integration with node apps (e.g. test fixtures). See the dendrite documentation for usage: https://matrix-org.github.io/dendrite/.

## Usage

`npm install dendrite-dist`

Put a `dendrite.yaml` in the current working directory.

```javascript
import dendrite, {init, createUser} from "dendrite-dist"
// This will create keys
await init()
// Then start the server
const server = await dendrite()
// Create a user
await createUser('testuser', 'testpassword')
// Use the server here
server.stop()
```

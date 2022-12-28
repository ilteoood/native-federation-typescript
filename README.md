# native-federation-typescript

Bundler agnostic plugin to share federated types.

## Install

```bash
npm i native-federation-typescript
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import {NativeFederationTypeScriptHost, NativeFederationTypeScriptRemote} from 'native-federation-typescript/vite'

export default defineConfig({
  plugins: [
    NativeFederationTypeScriptRemote({ /* options */ }),
    NativeFederationTypeScriptHost({ /* options */ }),
  ],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import {NativeFederationTypeScriptHost, NativeFederationTypeScriptRemote} from 'native-federation-typescript/rollup'

export default {
  plugins: [
    NativeFederationTypeScriptRemote({ /* options */ }),
    NativeFederationTypeScriptHost({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
const {NativeFederationTypeScriptHost, NativeFederationTypeScriptRemote} = require('native-federation-typescript/webpack')
module.exports = {
  /* ... */
  plugins: [
    NativeFederationTypeScriptRemote({ /* options */ }),
    NativeFederationTypeScriptHost({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import {NativeFederationTypeScriptHost, NativeFederationTypeScriptRemote} from 'native-federation-typescript/esbuild'

build({
  plugins: [NativeFederationTypeScriptRemote()],
})
```

<br></details>
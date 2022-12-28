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

## Options

### NativeFederationTypeScriptHost

```typescript
{
    moduleFederationConfig: any; // the configuration same configuration provided to the module federation plugin, it is MANDATORY
    typesFolder?: string; // folder where all the files will be stored, default is '@mf-types',
    deleteTypesFolder?: boolean; // indicate if the types folder will be deleted before the job starts, default is 'true'
}
```

### NativeFederationTypeScriptRemote

```typescript
{
    moduleFederationConfig: any; // the configuration same configuration provided to the module federation plugin, it is MANDATORY
    tsConfigPath?: string; // path where the tsconfig file is located, default is ''./tsconfig.json'
    typesFolder?: string; // folder where all the files will be stored, default is '@mf-types',
    compiledTypesFolder?: string; // folder where the federated modules types will be stored, default is 'compiled-types'
    deleteTypesFolder?: boolean; // indicate if the types folder will be deleted when the job completes, default is 'true'
}
```
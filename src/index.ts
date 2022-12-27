import { createUnplugin } from "unplugin";
import { retrieveConfig } from "./configutations/plugin";
import { RemoteOptions } from "./interfaces/RemoteOptions";
import { compileTs } from "./lib/TypeScriptCompiler";

export const NativeFederationTypeScriptRemote = createUnplugin((options: RemoteOptions) => {
  const { tsConfig, mapComponentsToExpose } = retrieveConfig(options)
  return {
    name: 'native-federation-typescript/remote',
    writeBundle() {
      compileTs(mapComponentsToExpose, tsConfig)
    }
  }
})
import { createUnplugin } from "unplugin";
import { retrieveConfig } from "./configutations/plugin";
import { UserOptions } from "./interfaces/UserOptions";
import { compileTs } from "./lib/TypeScriptCompiler";

export const NativeFederationTypeScriptRemote = createUnplugin((options: UserOptions) => {
  const { tsConfig, mapComponentsToExpose } = retrieveConfig(options)
  return {
    name: 'native-federation-typescript/remote',
    writeBundle() {
      compileTs(mapComponentsToExpose, tsConfig)
    }
  }
})
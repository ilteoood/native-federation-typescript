import { createUnplugin } from "unplugin";
import { retrieveConfig } from "./configutations/plugin";
import { UserOptions } from "./interfaces/UserOptions";
import { compileTs } from "./lib/TypeScriptCompiler";

const unplugin = createUnplugin((options: UserOptions) => {
  const { tsConfig, mapComponentsToExpose } = retrieveConfig(options)
  return {
    name: 'native-federation-typescript',
    writeBundle() {
      compileTs(mapComponentsToExpose, tsConfig)
    }
  }
})

export default unplugin
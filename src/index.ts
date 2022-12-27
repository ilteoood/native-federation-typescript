import typescript from "typescript";
import { createUnplugin } from "unplugin";
import { retrieveConfig } from "./configutations/plugin";
import { UserOptions } from "./interfaces/UserOptions";

const reportCompileDiagnostic = (diagnostic: typescript.Diagnostic): void => {
  const { line } = diagnostic.file!.getLineAndCharacterOfPosition(diagnostic.start!);

  console.error(`TS Error ${diagnostic.code}':' ${typescript.flattenDiagnosticMessageText(diagnostic.messageText, typescript.sys.newLine)}`);
  console.error(`         at ${diagnostic.file!.fileName}:${line + 1} typescript.sys.newLine`);
}

const unplugin = createUnplugin((options: UserOptions) => {
  const { userOptions, tsConfig } = retrieveConfig(options)
  return {
    name: 'native-federation-typescript',
    buildStart() {
      const componentsToExpose = Object.values(userOptions.moduleFederationConfig.exposes as Record<string, string>)
      const tsProgram = typescript.createProgram(componentsToExpose, tsConfig)
      const { diagnostics = [] } = tsProgram.emit()
      diagnostics.forEach(reportCompileDiagnostic)
    }
  }
})

export default unplugin
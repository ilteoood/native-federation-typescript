import typescript from "typescript"

const reportCompileDiagnostic = (diagnostic: typescript.Diagnostic): void => {
    const { line } = diagnostic.file!.getLineAndCharacterOfPosition(diagnostic.start!);

    console.error(`TS Error ${diagnostic.code}':' ${typescript.flattenDiagnosticMessageText(diagnostic.messageText, typescript.sys.newLine)}`);
    console.error(`         at ${diagnostic.file!.fileName}:${line + 1} typescript.sys.newLine`);
}

export const compileTs = (componentsToExpose: string[], tsConfig: typescript.CompilerOptions) => {
    const tsProgram = typescript.createProgram(componentsToExpose, tsConfig)
    const { diagnostics = [] } = tsProgram.emit()
    diagnostics.forEach(reportCompileDiagnostic)
}
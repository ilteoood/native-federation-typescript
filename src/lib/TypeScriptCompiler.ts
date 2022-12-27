import path from "path";
import typescript from "typescript";

const STARTS_WITH_SLASH = /^\//

const DEFINITION_FILE_EXTENSION = '.d.ts'

const reportCompileDiagnostic = (diagnostic: typescript.Diagnostic): void => {
    const { line } = diagnostic.file!.getLineAndCharacterOfPosition(diagnostic.start!);

    console.error(`TS Error ${diagnostic.code}':' ${typescript.flattenDiagnosticMessageText(diagnostic.messageText, typescript.sys.newLine)}`);
    console.error(`         at ${diagnostic.file!.fileName}:${line + 1} typescript.sys.newLine`);
}

const getPathToAppend = (componentsToExpose: string[]) => componentsToExpose.length === 1 ? path.basename(path.dirname(componentsToExpose[0])) : ''

const createHost = (mapComponentsToExpose: Record<string, string>, tsConfig: typescript.CompilerOptions) => {
    const pathToAppend = getPathToAppend(Object.values(mapComponentsToExpose))
    const outDir = path.join(tsConfig.outDir!, pathToAppend)

    const host = typescript.createCompilerHost({...tsConfig, outDir});
    const originalWriteFile = host.writeFile
    const mapExposeToEntry = Object.fromEntries(Object.entries(mapComponentsToExpose).map(entry => entry.reverse()))

    host.writeFile = (filepath, text, writeOrderByteMark, onError, sourceFiles, data) => {
        originalWriteFile(filepath, text, writeOrderByteMark, onError, sourceFiles, data)

        for (const sourceFile of sourceFiles || []) {
            const sourceEntry = mapExposeToEntry[sourceFile.fileName]
            if (sourceEntry) {
                const mfeTypeEntry = path.join(outDir.replace(pathToAppend, ''), `${sourceEntry}${DEFINITION_FILE_EXTENSION}`)
                const relativePathToOutput = path.join(pathToAppend, filepath.replace(outDir, '').replace(DEFINITION_FILE_EXTENSION, '').replace(STARTS_WITH_SLASH, ''))
                originalWriteFile(mfeTypeEntry, `export * from './${relativePathToOutput}';\nexport { default } from './${relativePathToOutput}';`, writeOrderByteMark)
            }
        }
    }

    return host
}

export const compileTs = (mapComponentsToExpose: Record<string, string>, tsConfig: typescript.CompilerOptions) => {
    const tsHost = createHost(mapComponentsToExpose, tsConfig)
    const tsProgram = typescript.createProgram(Object.values(mapComponentsToExpose), tsConfig, tsHost)

    const { diagnostics = [] } = tsProgram.emit()
    diagnostics.forEach(reportCompileDiagnostic)
}
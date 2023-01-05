import path from 'path'
import typescript from 'typescript'

import {RemoteOptions} from '../interfaces/RemoteOptions'

const STARTS_WITH_SLASH = /^\//

const DEFINITION_FILE_EXTENSION = '.d.ts'

const reportCompileDiagnostic = (diagnostic: typescript.Diagnostic): void => {
    const {line} = diagnostic.file!.getLineAndCharacterOfPosition(diagnostic.start!)

    console.error(`TS Error ${diagnostic.code}':' ${typescript.flattenDiagnosticMessageText(diagnostic.messageText, typescript.sys.newLine)}`)
    console.error(`         at ${diagnostic.file!.fileName}:${line + 1} typescript.sys.newLine`)
}

export const retrieveMfTypesPath = (tsConfig: typescript.CompilerOptions, remoteOptions: Required<RemoteOptions>) => path.normalize(tsConfig.outDir!.replace(remoteOptions.compiledTypesFolder, ''))
export const retrieveOriginalOutDir = (tsConfig: typescript.CompilerOptions, remoteOptions: Required<RemoteOptions>) => path.normalize(tsConfig.outDir!.replace(remoteOptions.compiledTypesFolder, '').replace(remoteOptions.typesFolder, ''))

const createHost = (mapComponentsToExpose: Record<string, string>, tsConfig: typescript.CompilerOptions, remoteOptions: Required<RemoteOptions>) => {
    const host = typescript.createCompilerHost(tsConfig)
    const originalWriteFile = host.writeFile
    const mapExposeToEntry = Object.fromEntries(Object.entries(mapComponentsToExpose).map(entry => entry.reverse()))
    const mfTypePath = retrieveMfTypesPath(tsConfig, remoteOptions)

    host.writeFile = (filepath, text, writeOrderByteMark, onError, sourceFiles, data) => {
        originalWriteFile(filepath, text, writeOrderByteMark, onError, sourceFiles, data)

        for (const sourceFile of sourceFiles || []) {
            const sourceEntry = mapExposeToEntry[sourceFile.fileName]
            if (sourceEntry) {
                const mfeTypeEntry = path.join(mfTypePath, `${sourceEntry}${DEFINITION_FILE_EXTENSION}`)
                const relativePathToOutput = path.relative(mfTypePath, filepath).replace(DEFINITION_FILE_EXTENSION, '').replace(STARTS_WITH_SLASH, '')
                originalWriteFile(mfeTypeEntry, `export * from './${relativePathToOutput}';\nexport { default } from './${relativePathToOutput}';`, writeOrderByteMark)
            }
        }
    }

    return host
}

export const compileTs = (mapComponentsToExpose: Record<string, string>, tsConfig: typescript.CompilerOptions, remoteOptions: Required<RemoteOptions>) => {
    const tsHost = createHost(mapComponentsToExpose, tsConfig, remoteOptions)
    const filesToCompile = [...Object.values(mapComponentsToExpose), ...remoteOptions.additionalFilesToCompile]
    const tsProgram = typescript.createProgram(filesToCompile, tsConfig, tsHost)

    const {diagnostics = []} = tsProgram.emit()
    diagnostics.forEach(reportCompileDiagnostic)
}

import fs from 'fs';
import path from 'path';
import typescript from "typescript";
import { RemoteOptions } from "../interfaces/RemoteOptions";

const defaultOptions = {
    tsConfigPath: './tsconfig.json',
    typesFolder: '@mf-types'
}

const readTsConfig = ({ tsConfigPath, typesFolder }: Required<RemoteOptions>): typescript.CompilerOptions => {
    const resolvedTsConfigPath = path.resolve(tsConfigPath)

    const readResult = typescript.readConfigFile(path.basename(resolvedTsConfigPath), typescript.sys.readFile);
    const configContent = typescript.parseJsonConfigFileContent(readResult.config, typescript.sys, path.dirname(resolvedTsConfigPath));
    const outDir = path.join(configContent.options.outDir || 'dist', typesFolder);

    return { ...configContent.options, emitDeclarationOnly: true, noEmit: false, declaration: true, outDir };
}

const TS_EXTENSIONS = ['ts', 'tsx']

const resolveWithExtension = (exposedPath: string) => {
    const cwd = process.cwd()
    for (const extension of TS_EXTENSIONS) {
        const exposedPathWithExtension = path.join(cwd, `${exposedPath}.${extension}`)
        if (fs.existsSync(exposedPathWithExtension)) return exposedPathWithExtension
    }
    return undefined
}

export const resolveExposes = (userOptions: RemoteOptions) => {
    return Object.entries(userOptions.moduleFederationConfig.exposes as Record<string, string>)
        .reduce((accumulator, [exposedEntry, exposedPath]) => {
            accumulator[exposedEntry] = resolveWithExtension(exposedPath) || resolveWithExtension(path.join(exposedPath, 'index')) || exposedPath
            return accumulator
        }, {} as Record<string, string>);
}

export const retrieveConfig = (options: RemoteOptions) => {
    if (!options.moduleFederationConfig) {
        throw new Error('moduleFederationConfig is required')
    }

    const userOptions: Required<RemoteOptions> = { ...defaultOptions, ...options }
    const mapComponentsToExpose = resolveExposes(userOptions)
    const tsConfig = readTsConfig(userOptions)

    return {
        tsConfig,
        mapComponentsToExpose
    }
}
import fs from 'fs';
import path from 'path';
import typescript from "typescript";
import { UserOptions } from "../interfaces/UserOptions";

const defaultOptions = {
    tsConfigPath: './tsconfig.json',
    typesFolder: '@mf-types'
}

const readTsConfig = ({ tsConfigPath, typesFolder }: Required<UserOptions>): typescript.CompilerOptions => {
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

export const resolveExposes = (userOptions: UserOptions) => {
    return Object.values(userOptions.moduleFederationConfig.exposes as Record<string, string>)
        .map(exposedPath => resolveWithExtension(exposedPath) || resolveWithExtension(path.join(exposedPath, 'index')) || exposedPath)
}

export const retrieveConfig = (options: UserOptions) => {
    if (!options.moduleFederationConfig) {
        throw new Error('moduleFederationConfig is required')
    }

    const userOptions: Required<UserOptions> = { ...defaultOptions, ...options }
    const tsConfig = readTsConfig(userOptions)

    return {
        userOptions,
        tsConfig
    }
}
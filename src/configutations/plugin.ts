import path from 'path';
import typescript from "typescript";
import { UserOptions } from "../interfaces/UserOptions";

const defaultOptions = {
    tsConfigPath: './tsconfig.json',
    typesFolder: '@mf-types'
}

const readTsConfig = ({tsConfigPath, typesFolder}: Required<UserOptions>): typescript.CompilerOptions => {
    const resolvedTsConfigPath = path.resolve(tsConfigPath)

    const readResult = typescript.readConfigFile(path.basename(resolvedTsConfigPath), typescript.sys.readFile);
    const configContent = typescript.parseJsonConfigFileContent(readResult.config, typescript.sys, path.dirname(resolvedTsConfigPath));
    const outDir = path.join(configContent.options.outDir || 'dist', typesFolder);

    return {...configContent.options, emitDeclarationOnly: true, outDir};
}

export const retrieveConfig = (options: UserOptions) => {
    if(!options.moduleFederationConfig) {
        throw new Error('Invalid moduleFederationConfig')
    }

    const userOptions: Required<UserOptions> = {...defaultOptions, ...options}
    const tsConfig = readTsConfig(userOptions)

    return {
        userOptions,
        tsConfig
    }
}
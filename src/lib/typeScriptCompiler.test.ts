import {join, sep} from 'path'
import {describe, expect, it} from 'vitest'

import {RemoteOptions} from '../interfaces/RemoteOptions'
import {retrieveMfTypesPath, retrieveOriginalOutDir} from './typeScriptCompiler'

describe('typeScriptCompiler', () => {
    const tsConfig = {
        outDir: join('foo', 'typesRemoteFolder', 'compiledTypesFolder')
    }

    const remoteOptions: Required<RemoteOptions> = {
        additionalFilesToCompile: [],
        compiledTypesFolder: 'compiledTypesFolder',
        typesFolder: 'typesRemoteFolder',
        moduleFederationConfig: {},
        tsConfigPath: './tsconfig.json',
        deleteTypesFolder: false
    }

    it('retrieveMfTypesPath correctly calculate path', () => {
        const expectedPath = join('foo', 'typesRemoteFolder') + sep
        const retrievedMfTypesPath = retrieveMfTypesPath(tsConfig, remoteOptions)

        expect(retrievedMfTypesPath).toBe(expectedPath)
    })

    it('retrieveOriginalOutDir correctly calculate path', () => {
        const expectedPath = 'foo' + sep
        const retrievedOriginalOutDir = retrieveOriginalOutDir(tsConfig, remoteOptions)

        expect(retrievedOriginalOutDir).toBe(expectedPath)
    })
})
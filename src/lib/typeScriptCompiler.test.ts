import {join, sep} from 'path'
import {describe, expect, it} from 'vitest'

import {RemoteOptions} from '../interfaces/RemoteOptions'
import {retrieveMfTypesPath, retrieveOriginalOutDir} from './typeScriptCompiler'

describe('typeScriptCompiler', () => {
    const tsConfig = {
        outDir: join('foo', 'typesRemoteFolder', 'compiledTypesFolder')
    }

    const remoteOptions: Required<RemoteOptions> = {
        compiledTypesFolder: 'compiledTypesFolder',
        typesFolder: 'typesRemoteFolder',
        moduleFederationConfig: {},
        tsConfigPath: './tsconfig.json',
        deleteTypesFolder: false
    }

    it('retrieveMfTypesPath correctly calculate path', () => {
        const expectedPath = join('foo', 'typesRemoteFolder') + sep
        expect(retrieveMfTypesPath(tsConfig, remoteOptions)).toBe(expectedPath)
    })

    it('retrieveOriginalOutDir correctly calculate path', () => {
        const expectedPath = 'foo' + sep
        expect(retrieveOriginalOutDir(tsConfig, remoteOptions)).toBe(expectedPath)
    })
})
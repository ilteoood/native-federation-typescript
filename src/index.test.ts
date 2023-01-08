import {describe, expect, it} from 'vitest'

import {NativeFederationTypeScriptRemote} from './index'

describe('index', () => {
    describe('NativeFederationTypeScriptRemote', () => {
        it('throws for missing moduleFederationConfig', () => {
            const options = {
                tsConfigPath: './tsconfig.json',
                typesFolder: '@mf-types',
                compiledTypesFolder: 'compiled-types',
                deleteTypesFolder: true,
                additionalFilesToCompile: []
            }

            // @ts-expect-error missing moduleFederationConfig
            const writeBundle = () => NativeFederationTypeScriptRemote.raw(options, undefined)
            expect(writeBundle).toThrowError('moduleFederationConfig is required')
        })
    })
})
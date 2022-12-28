import {describe, expect, it} from 'vitest'

import {retrieveRemoteConfig} from './remotePlugin'

describe('hostPlugin', () => {
    const moduleFederationConfig = {
        name: 'moduleFederationHost',
        filename: 'remoteEntry.js',
        exposes: {
            './button': './src/components/button',
            './anotherButton': './src/components/anotherButton'
        },
        shared: {
            react: {singleton: true, eager: true},
            'react-dom': {singleton: true, eager: true}
        },
    }

    describe('retrieveRemoteConfig', () => {
        it('throws for missing module federation configuration', () => {
            // @ts-expect-error Missing module federation configuration
            const invokeRetrieve = () => retrieveRemoteConfig({})
            expect(invokeRetrieve).toThrowError('moduleFederationConfig is required')
        })

        describe('correctly intersect with default options', () => {
            it('only moduleFederationConfig provided', () => {
                const {tsConfig, mapComponentsToExpose, remoteOptions} = retrieveRemoteConfig({
                    moduleFederationConfig
                })

                expect(tsConfig).toStrictEqual({
                    target: 4,
                    module: 99,
                    lib: ['lib.esnext.d.ts'],
                    moduleResolution: 2,
                    esModuleInterop: true,
                    strict: true,
                    strictNullChecks: true,
                    resolveJsonModule: true,
                    configFilePath: undefined,
                    emitDeclarationOnly: true,
                    noEmit: false,
                    declaration: true,
                    outDir: 'dist/@mf-types/compiled-types'
                })

                expect(mapComponentsToExpose).toStrictEqual({
                    './anotherButton': './src/components/anotherButton',
                    './button': './src/components/button',
                })

                expect(remoteOptions).toStrictEqual({
                    tsConfigPath: './tsconfig.json',
                    typesFolder: '@mf-types',
                    compiledTypesFolder: 'compiled-types',
                    deleteTypesFolder: true,
                    moduleFederationConfig
                })
            })

            it('all options provided', () => {
                const {tsConfig, mapComponentsToExpose, remoteOptions} = retrieveRemoteConfig({
                    moduleFederationConfig,
                    typesFolder: 'typesFolder',
                    compiledTypesFolder: 'compiledTypesFolder',
                    deleteTypesFolder: false
                })

                expect(tsConfig).toStrictEqual({
                    target: 4,
                    module: 99,
                    lib: ['lib.esnext.d.ts'],
                    moduleResolution: 2,
                    esModuleInterop: true,
                    strict: true,
                    strictNullChecks: true,
                    resolveJsonModule: true,
                    configFilePath: undefined,
                    emitDeclarationOnly: true,
                    noEmit: false,
                    declaration: true,
                    outDir: 'dist/typesFolder/compiledTypesFolder'
                })

                expect(mapComponentsToExpose).toStrictEqual({
                    './anotherButton': './src/components/anotherButton',
                    './button': './src/components/button',
                })

                expect(remoteOptions).toStrictEqual({
                    tsConfigPath: './tsconfig.json',
                    typesFolder: 'typesFolder',
                    compiledTypesFolder: 'compiledTypesFolder',
                    deleteTypesFolder: false,
                    moduleFederationConfig
                })
            })

        })
    })
})
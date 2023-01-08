import dirTree from 'directory-tree'
import {join} from 'path'
import {UnpluginOptions} from 'unplugin'
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
            const writeBundle = () => NativeFederationTypeScriptRemote.rollup(options)
            expect(writeBundle).toThrowError('moduleFederationConfig is required')
        })

        it('correctly writeBundle', async () => {
            const options = {
                moduleFederationConfig: {
                    name: 'moduleFederationTypescript',
                    filename: 'remoteEntry.js',
                    exposes: {
                        './index': './src/index.ts',
                    },
                    shared: {
                        react: {singleton: true, eager: true},
                        'react-dom': {singleton: true, eager: true}
                    },
                },
                tsConfigPath: './tsconfig.json',
                typesFolder: '@mf-types',
                compiledTypesFolder: 'compiled-types',
                deleteTypesFolder: false,
                additionalFilesToCompile: []
            }

            const distFolder = join('./dist', options.typesFolder)

            const unplugin = NativeFederationTypeScriptRemote.rollup(options) as UnpluginOptions
            await unplugin.writeBundle?.()

            expect(dirTree(distFolder)).toMatchObject({
                name: '@mf-types',
                children: [
                    {
                        name: 'compiled-types',
                        children: [
                            {
                                name: 'configurations',
                                children: [
                                    {
                                        name: 'hostPlugin.d.ts'
                                    },
                                    {
                                        name: 'remotePlugin.d.ts'
                                    }
                                ]
                            },
                            {
                                name: 'index.d.ts'
                            },
                            {
                                name: 'interfaces',
                                children: [
                                    {
                                        name: 'HostOptions.d.ts'
                                    },
                                    {
                                        name: 'RemoteOptions.d.ts'
                                    }
                                ]
                            },
                            {
                                name: 'lib',
                                children: [
                                    {
                                        name: 'archiveHandler.d.ts'
                                    },
                                    {
                                        name: 'typeScriptCompiler.d.ts'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
        })
    })
})
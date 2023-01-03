import {existsSync, mkdirSync, mkdtempSync, rmSync} from 'fs'
import os from 'os'
import path from 'path'
import {afterAll, describe, expect, it} from 'vitest'

import {RemoteOptions} from '../interfaces/RemoteOptions'
import {createTypesArchive} from './archiveHandler'

describe('archiveHandler', () => {
    const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'archive-handler'))
    const tsConfig = {
        outDir: path.join(tmpDir, 'typesFolder', 'compiledTypesFolder')
    }

    mkdirSync(tsConfig.outDir, {recursive: true})

    const remoteOptions: Required<RemoteOptions> = {
        compiledTypesFolder: 'compiledTypesFolder',
        typesFolder: 'typesFolder',
        moduleFederationConfig: {},
        tsConfigPath: './tsconfig.json',
        deleteTypesFolder: false
    }

    afterAll(() => {
        rmSync(tmpDir, {recursive: true})
    })

    describe('createTypesArchive', () => {
        it('correctly creates archive', async () => {
            const archivePath = path.join(tmpDir, `${remoteOptions.typesFolder}.zip`)

            const archiveCreated = await createTypesArchive(tsConfig, remoteOptions)

            expect(archiveCreated).toBeTruthy()
            expect(existsSync(archivePath)).toBeTruthy()
        })

        it('throw for unexisting outDir', async () => {
            expect(createTypesArchive({...tsConfig, outDir: '/foo'}, remoteOptions)).rejects.toThrowError()
        })
    })
})
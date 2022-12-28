import {rm} from 'fs/promises'
import {createUnplugin} from 'unplugin'

import {retrieveHostConfig} from './configutations/hostPlugin'
import {retrieveRemoteConfig} from './configutations/remotePlugin'
import {HostOptions} from './interfaces/HostOptions'
import {RemoteOptions} from './interfaces/RemoteOptions'
import {createTypesArchive, downloadTypesArchive} from './lib/archiveHandler'
import {compileTs, retrieveMfTypesPath} from './lib/typeScriptCompiler'

export const NativeFederationTypeScriptRemote = createUnplugin((options: RemoteOptions) => {
  const {remoteOptions, tsConfig, mapComponentsToExpose} = retrieveRemoteConfig(options)
  return {
    name: 'native-federation-typescript/remote',
    async writeBundle() {
      compileTs(mapComponentsToExpose, tsConfig, remoteOptions)

      await createTypesArchive(tsConfig, remoteOptions)

      if (remoteOptions.deleteTypesFolder) {
        await rm(retrieveMfTypesPath(tsConfig, remoteOptions), {recursive: true, force: true})
      }
    }
  }
})

export const NativeFederationTypeScriptHost = createUnplugin((options: HostOptions) => {
  const {hostOptions, mapRemotesToDownload} = retrieveHostConfig(options)
  return {
    name: 'native-federation-typescript/host',
    async writeBundle() {
      if (hostOptions.deleteTypesFolder) {
        await rm(hostOptions.typesFolder, {recursive: true, force: true})
      }

      const typesDownloader = downloadTypesArchive(hostOptions)
      const downloadPromises = Object.entries(mapRemotesToDownload).map(typesDownloader)

      await Promise.allSettled(downloadPromises)
    }
  }
})
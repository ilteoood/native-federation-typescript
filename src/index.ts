import AdmZip from "adm-zip";
import axios from "axios";
import { rm } from "fs/promises";
import path from "path";
import typescript from "typescript";
import { createUnplugin } from "unplugin";

import { retrieveHostConfig } from "./configutations/hostPlugin";
import { retrieveRemoteConfig } from "./configutations/remotePlugin";
import { RemoteOptions } from "./interfaces/RemoteOptions";
import { compileTs, retrieveMfTypesPath } from "./lib/TypeScriptCompiler";

const retrieveTypesZipPath = (mfTypesPath: string, remoteOptions: Required<RemoteOptions>) => path.join(mfTypesPath.replace(remoteOptions.typesFolder, ''), `${remoteOptions.typesFolder}.zip`)

const createTypesArchive = async (tsConfig: typescript.CompilerOptions, remoteOptions: Required<RemoteOptions>) => {
  const mfTypesPath = retrieveMfTypesPath(tsConfig, remoteOptions)
  const zip = new AdmZip()
  zip.addLocalFolder(mfTypesPath)
  await zip.writeZipPromise(retrieveTypesZipPath(mfTypesPath, remoteOptions))
}

export const NativeFederationTypeScriptRemote = createUnplugin((options: RemoteOptions) => {
  const { remoteOptions, tsConfig, mapComponentsToExpose } = retrieveRemoteConfig(options)
  return {
    name: 'native-federation-typescript/remote',
    async writeBundle() {
      compileTs(mapComponentsToExpose, tsConfig, remoteOptions)

      await createTypesArchive(tsConfig, remoteOptions)

      if (remoteOptions.deleteTypesFolder) {
        await rm(tsConfig.outDir!, { recursive: true })
      }
    }
  }
})

const downloadErrorLogger = (destinationFolder: string, fileToDownload: string) => (reason: any) => {
  console.error(`Unable to download federated types for '${destinationFolder}' from '${fileToDownload}' because '${reason.message}', skipping...`)
  throw reason
}

export const NativeFederationTypeScriptHost = createUnplugin((options: RemoteOptions) => {
  const { hostOptions, mapRemotesToDownload } = retrieveHostConfig(options)
  return {
    name: 'native-federation-typescript/remote',
    async writeBundle() {
      if (hostOptions.deleteTypesFolders) {
        await rm(hostOptions.typesFolder, { recursive: true })
      }

      const downloadPromises = Object.entries(mapRemotesToDownload).map(async ([destinationFolder, fileToDownload]) => {
        const response = await axios.get(fileToDownload, { responseType: 'arraybuffer' }).catch(downloadErrorLogger(destinationFolder, fileToDownload))

        const destinationPath = path.join(hostOptions.typesFolder, destinationFolder)

        const zip = new AdmZip(Buffer.from(response.data))
        zip.extractAllTo(destinationPath, true)
      })

      await Promise.allSettled(downloadPromises)
    }
  }
})
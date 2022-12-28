import AdmZip from "adm-zip";
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
      if(remoteOptions.deleteTypesFolder) {
        await rm(tsConfig.outDir!, {recursive: true})
      }
    }
  }
})
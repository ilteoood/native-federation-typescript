import AdmZip from "adm-zip";
import { rm } from "fs/promises";
import path from "path";
import typescript from "typescript";
import { createUnplugin } from "unplugin";

import { retrieveConfig } from "./configutations/plugin";
import { RemoteOptions } from "./interfaces/RemoteOptions";
import { compileTs } from "./lib/TypeScriptCompiler";

const retrieveTypesZipPath = (tsConfig: typescript.CompilerOptions, remoteOptions: Required<RemoteOptions>) => path.join(tsConfig.outDir!.replace(remoteOptions.typesFolder, ''), `${remoteOptions.typesFolder}.zip`)

const createTypesArchive = async (tsConfig: typescript.CompilerOptions, remoteOptions: Required<RemoteOptions>) => {
  const zip = new AdmZip()
  zip.addLocalFolder(tsConfig.outDir!)
  await zip.writeZipPromise(retrieveTypesZipPath(tsConfig, remoteOptions))
}

export const NativeFederationTypeScriptRemote = createUnplugin((options: RemoteOptions) => {
  const { remoteOptions, tsConfig, mapComponentsToExpose } = retrieveConfig(options)
  return {
    name: 'native-federation-typescript/remote',
    async writeBundle() {
      compileTs(mapComponentsToExpose, tsConfig)
      await createTypesArchive(tsConfig, remoteOptions)
      if(remoteOptions.deleteTypesFolder) {
        await rm(tsConfig.outDir!, {recursive: true})
      }
    }
  }
})
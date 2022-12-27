import AdmZip from "adm-zip";
import { rm } from "fs/promises";
import path from "path";
import typescript from "typescript";
import { createUnplugin } from "unplugin";

import { retrieveConfig } from "./configutations/plugin";
import { RemoteOptions } from "./interfaces/RemoteOptions";
import { compileTs } from "./lib/TypeScriptCompiler";

const retrieveTypesZipPath = (tsConfig: typescript.CompilerOptions, userOptions: Required<RemoteOptions>) => path.join(tsConfig.outDir!.replace(userOptions.typesFolder, ''), `${userOptions.typesFolder}.zip`)

const createTypesArchive = async (tsConfig: typescript.CompilerOptions, userOptions: Required<RemoteOptions>) => {
  const zip = new AdmZip()
  zip.addLocalFolder(tsConfig.outDir!)
  await zip.writeZipPromise(retrieveTypesZipPath(tsConfig, userOptions))
}

export const NativeFederationTypeScriptRemote = createUnplugin((options: RemoteOptions) => {
  const { userOptions, tsConfig, mapComponentsToExpose } = retrieveConfig(options)
  return {
    name: 'native-federation-typescript/remote',
    async writeBundle() {
      compileTs(mapComponentsToExpose, tsConfig)
      await createTypesArchive(tsConfig, userOptions)
      await rm(tsConfig.outDir!, {recursive: true})
    }
  }
})
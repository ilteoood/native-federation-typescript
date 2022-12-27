import archiver from "archiver";
import fs from "fs";
import path from "path";
import typescript from "typescript";
import { createUnplugin } from "unplugin";

import { retrieveConfig } from "./configutations/plugin";
import { RemoteOptions } from "./interfaces/RemoteOptions";
import { compileTs } from "./lib/TypeScriptCompiler";

const createTypesArchive = async (tsConfig: typescript.CompilerOptions, userOptions: Required<RemoteOptions>) => {
  const output = fs.createWriteStream(path.join(tsConfig.outDir!, `${userOptions.typesFolder}.zip`));
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output)
  archive.directory(tsConfig.outDir!, false)

  return archive.finalize()
}

export const NativeFederationTypeScriptRemote = createUnplugin((options: RemoteOptions) => {
  const { userOptions, tsConfig, mapComponentsToExpose } = retrieveConfig(options)
  return {
    name: 'native-federation-typescript/remote',
    async writeBundle() {
      compileTs(mapComponentsToExpose, tsConfig)
      await createTypesArchive(tsConfig, userOptions)
    }
  }
})
import type { ModuleFederationPluginOptions } from '@module-federation/utilities';

export interface UserOptions {
    moduleFederationConfig: ModuleFederationPluginOptions,
    tsConfigPath?: string,
    typesFolder?: string
}
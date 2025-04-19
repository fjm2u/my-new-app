import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import MakerDMG from "@electron-forge/maker-dmg";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './public/images/icon/icon',
    osxSign: {
      identity: process.env.PUBLIC_IDENTIFIER,
    },
    osxNotarize: {
      appleApiKey: process.env.APPLE_API_KEY || '',
      appleApiKeyId: process.env.APPLE_API_KEY_ID || '',
      appleApiIssuer: process.env.APPLE_API_ISSUER || '',
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "Example",
      authors: "fjm2u",
      description: "Example",
      setupIcon: "images/icon/icon.ico"
    }),
    new MakerDMG({
      name: "Example",
      format: 'ULFO',
      icon: './images/icon/icon.icns',
    }, ['darwin']),
    new MakerZIP()
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        authToken: process.env.GITHUB_TOKEN,
        repository: {
          owner: 'fjm2u',
          name: 'my-new-app'
        },
        prerelease: true,
        draft: true
      }
    }
  ]
};

export default config;

import type { ForgeConfig } from '@electron-forge/shared-types';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'Blackout Chat',
    executableName: 'blackout-chat',
    osxSign: {},
    icon: './electron/icons',
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'graphland-dev',
          name: 'blackout-chat',
        },
        prerelease: true,
      },
    },
  ],
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        authors: 'Electron contributors',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        icon: './electron/icons',
      },
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {},
    },
  ],
};

export default config;

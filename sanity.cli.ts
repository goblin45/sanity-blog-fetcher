import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    // projectId: '12jszf8z',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  },
  deployment: {
    appId: process.env.NEXT_PUBLIC_SANITY_APP_ID!,
    // appId: 'o3a5z0yg2v4xn3q8cqtnl6z4',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})

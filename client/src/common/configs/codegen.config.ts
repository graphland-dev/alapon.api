import { CodegenConfig } from '@graphql-codegen/cli';

// import dotenv from "dotenv";

// dotenv.config({
//   path: [".env", ".env.local", ".env.development", ".env.development.local"],
// });

const config: CodegenConfig = {
  schema: `http://localhost:4001/graphql`,
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/common/api-models/': {
      preset: 'client',
    },
  },
};

export default config;

const child_process = require('child_process');
const path = require('path');

// set the env variables

process.env.VITE_API_HOST = 'https://blackout.rayhan.dev/graphql';
process.env.VITE_SOCKET_HOST = 'wss://blackout.rayhan.dev/socket';
process.env.NODE_ENV = 'prod';

// build the web client
child_process.execSync('cd ../web-client && npm run build', {});

// first delete the client-dist folder
child_process.execSync('rm -rf ./client-dist', {});

child_process.execSync('cp -r ../web-client/dist ./client-dist', {});

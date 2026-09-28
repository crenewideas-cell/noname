const path = require('node:path');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '../output/windows/win-unpacked/resources/app');
Object.assign(window, { __dirname: root, require: createRequire(path.join(root, 'package.json')) });

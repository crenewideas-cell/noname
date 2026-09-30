import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { developmentPorts } from './dev-ports.mjs';

test('development ports keep defaults and honor local settings and environment precedence', t => {
 const directory = mkdtempSync(join(tmpdir(), 'noname-dev-ports-'));
 t.after(() => rmSync(directory, {recursive:true, force:true}));
 assert.deepEqual(developmentPorts(directory, {}), {client:8081, server:8089});
 writeFileSync(join(directory, '.env'), 'NONAME_DEV_PORT=9001\nNONAME_FS_PORT=9009');
 writeFileSync(join(directory, '.env.development.local'), 'NONAME_DEV_PORT="18081"\nNONAME_FS_PORT=18089 # local');
 assert.deepEqual(developmentPorts(directory, {}), {client:18081, server:18089});
 assert.deepEqual(developmentPorts(directory, {NONAME_FS_PORT:'19089'}), {client:18081, server:19089});
 for (const invalid of ['0','65536','-1','1.5','8081;echo','']) assert.throws(() => developmentPorts(directory, {NONAME_DEV_PORT:invalid}), /整数端口/);
 assert.throws(() => developmentPorts(directory, {NONAME_DEV_PORT:'18089'}), /同一端口/);
});

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

let server;
let baseUrl;

before(async () => {
  server = createApp();
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => server.close());

const post = (path, body) =>
  fetch(baseUrl + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

test('POST /encode returns encoded text', async () => {
  const res = await post('/encode', { text: 'Hello, World!' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { result: 'Itssg, Vgksr!' });
});

test('POST /decode returns decoded text', async () => {
  const res = await post('/decode', { text: 'Itssg, Vgksr!' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { result: 'Hello, World!' });
});

test('missing text returns 400', async () => {
  const res = await post('/encode', {});
  assert.equal(res.status, 400);
});

test('invalid JSON returns 400', async () => {
  const res = await post('/encode', '{not json');
  assert.equal(res.status, 400);
});

test('invalid key returns 400', async () => {
  const res = await post('/encode', { text: 'abc', key: 'ABC' });
  assert.equal(res.status, 400);
});

test('GET is not allowed', async () => {
  const res = await fetch(baseUrl + '/encode');
  assert.equal(res.status, 405);
});

test('unknown route returns 404', async () => {
  const res = await post('/nope', { text: 'abc' });
  assert.equal(res.status, 404);
});

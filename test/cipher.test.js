import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode } from '../src/cipher.js';

test('encode substitutes letters and preserves case and punctuation', () => {
  assert.equal(encode('Hello, World!'), 'Itssg, Vgksr!');
});

test('decode reverses encode', () => {
  const text = 'The quick brown fox jumps over the lazy dog. 123';
  assert.equal(decode(encode(text)), text);
});

test('custom key round-trips', () => {
  const key = 'ZYXWVUTSRQPONMLKJIHGFEDCBA';
  assert.equal(encode('abc', key), 'zyx');
  assert.equal(decode('zyx', key), 'abc');
});

test('invalid key throws', () => {
  assert.throws(() => encode('abc', 'ABC'), /exactly once/);
  assert.throws(() => encode('abc', 'AACDEFGHIJKLMNOPQRSTUVWXYZ'), /exactly once/);
});

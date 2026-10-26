const PLAIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DEFAULT_KEY = 'QWERTYUIOPASDFGHJKLZXCVBNM';

function buildMap(from, to) {
  const map = new Map();
  for (let i = 0; i < from.length; i++) {
    map.set(from[i], to[i]);
    map.set(from[i].toLowerCase(), to[i].toLowerCase());
  }
  return map;
}

function validateKey(key) {
  const upper = key.toUpperCase();
  if (upper.length !== 26 || new Set(upper).size !== 26 || !/^[A-Z]+$/.test(upper)) {
    throw new Error('Key must contain each letter A-Z exactly once');
  }
  return upper;
}

function substitute(text, map) {
  let out = '';
  for (const ch of text) out += map.get(ch) ?? ch;
  return out;
}

// Letters are substituted case-preservingly; all other characters pass through unchanged.
export function encode(text, key = DEFAULT_KEY) {
  return substitute(text, buildMap(PLAIN, validateKey(key)));
}

export function decode(text, key = DEFAULT_KEY) {
  return substitute(text, buildMap(validateKey(key), PLAIN));
}

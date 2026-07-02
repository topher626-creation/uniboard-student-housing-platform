import test from 'node:test';
import assert from 'node:assert/strict';

import { parseVerificationImages } from '../utils/verification';

test('parses a JSON array of verification image URLs', () => {
  assert.deepEqual(parseVerificationImages('["/uploads/a.png","/uploads/b.png"]'), [
    '/uploads/a.png',
    '/uploads/b.png',
  ]);
});

test('accepts a single string value and normalizes it to an array', () => {
  assert.deepEqual(parseVerificationImages('/uploads/a.png'), ['/uploads/a.png']);
});

test('ignores empty and non-array values', () => {
  assert.deepEqual(parseVerificationImages(undefined), []);
  assert.deepEqual(parseVerificationImages(''), []);
  assert.deepEqual(parseVerificationImages(['', '/uploads/a.png']), ['/uploads/a.png']);
});

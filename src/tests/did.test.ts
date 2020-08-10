import { validateDid } from '../did/did-validator';

test('DID start without "did" returns false', () => {
  const invalidDid = `d:schema:evan-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has no "schema" returns false', () => {
  const invalidDid = `did:evan-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has a not supported network returns false', () => {
  const invalidDid = `did:schema:evan_test_ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has a not supported "type-hint" returns false', () => {
  const invalidDid = `did:evan-ipfs:type-hint=q-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has no "hash" returns false', () => {
  const invalidDid = `did:schema:evan-ipfs:type-hint=json-schema`;
  const validationResult = validateDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has long hash returns false', () => {
  const invalidDid = `did:schema:evan-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567cc`;
  const validationResult = validateDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has short hash returns false', () => {
  const invalidDid = `did:schema:evan-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda0556`;
  const validationResult = validateDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('correct DID with evan ipfs as network returns true', () => {
  const validDid = `did:schema:evan-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateDid(validDid);
  expect(validationResult).toBe(true);
});

test('correct DID with public ipfs as network true', () => {
  const validDid = `did:schema:public-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateDid(validDid);
  expect(validationResult).toBe(true);
});

test('DID has no "type-hint" returns true', () => {
  const validDid = `did:schema:evan-ipfs:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateDid(validDid);
  expect(validationResult).toBe(true);
});

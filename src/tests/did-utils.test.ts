import { validateSchemaDid, parseSchemaDid, stringifySchemaDid } from '../did/did-utils';
import { SchemaDid, Network, SchemaType } from '../model';

test('DID start without "did" returns false', () => {
  const invalidDid = `d:schema:evan-ipfs:json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateSchemaDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has no "schema" returns false', () => {
  const invalidDid = `did:evan-ipfs:json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateSchemaDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has a not supported network returns false', () => {
  const invalidDid = `did:schema:evan_test_ipfs:json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateSchemaDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has a not supported "type-hint" returns false', () => {
  const invalidDid = `did:evan-ipfs:q-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateSchemaDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has no "hash" returns false', () => {
  const invalidDid = `did:schema:evan-ipfs:json-schema:`;
  const validationResult = validateSchemaDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('DID has no "hash" and no "type hint" returns false', () => {
  const invalidDid = `did:schema:evan-ipfs:`;
  const validationResult = validateSchemaDid(invalidDid);
  expect(validationResult).toBe(false);
});

test('correct DID with ipfs hash returns true', () => {
  const validDid = `did:schema:evan-ipfs:json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51`;
  const validationResult = validateSchemaDid(validDid);
  expect(validationResult).toBe(true);
});

test('correct DID with evan ipfs as network returns true', () => {
  const validDid = `did:schema:evan-ipfs:json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateSchemaDid(validDid);
  expect(validationResult).toBe(true);
});

test('correct DID with id includes - . _ returns true', () => {
  const validDid = `did:schema:evan-ipfs:json-schema:0xa937ea507c396d_d417be352825c65-5fdf1e6fb60e83.8db03f2cccda05567c`;
  const validationResult = validateSchemaDid(validDid);
  expect(validationResult).toBe(true);
});

test('correct DID with public ipfs as network returns true', () => {
  const validDid = `did:schema:public-ipfs:json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateSchemaDid(validDid);
  expect(validationResult).toBe(true);
});

test('DID has no "type-hint" returns true', () => {
  const validDid = `did:schema:evan-ipfs:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const validationResult = validateSchemaDid(validDid);
  expect(validationResult).toBe(true);
});

test('parse and stringify did with type hint', () => {
  const didObject: SchemaDid = {
    did: 'did',
    method: 'schema',
    network: Network.EvanIpfs,
    typeHint: SchemaType.JsonSchema,
    hash: '0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c'
  }
  const validDid = `did:schema:evan-ipfs:json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const resultObject = parseSchemaDid(validDid);
  expect(resultObject).toStrictEqual(didObject);
  const didAsString = stringifySchemaDid(resultObject);
  expect(didAsString).toStrictEqual(validDid);
});

test('parse and stringify did without type hint', () => {
  const didObject: SchemaDid = {
    did: 'did',
    method: 'schema',
    network: Network.EvanIpfs,
    hash: '0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c'
  }
  const validDid = `did:schema:evan-ipfs:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c`;
  const resultObject = parseSchemaDid(validDid);
  expect(resultObject).toStrictEqual(didObject);
  const didAsString = stringifySchemaDid(resultObject);
  expect(didAsString).toStrictEqual(validDid);
});

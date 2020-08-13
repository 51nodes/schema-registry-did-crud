import * as IpfsHttpClient from 'ipfs-http-client';
import { getConfig } from '../schema-registry';
import { Logger } from 'tslog';

// tslint:disable: variable-name && no-var-requires
const BufferList = require('bl/BufferList')
// tslint:enable: variable-name && no-var-requires

const log: Logger = new Logger({ name: 'Public Ipfs Service' });

async function addSchemaToPublicIpfs(schemaAsString: string): Promise<string> {
  const ipfs = await initPublicIpfs();
  log.debug(`Add schema to public ipfs: ${schemaAsString}`);
  const resultObject = await ipfs.add(schemaAsString);
  let ipfsHash: string;
  for await (const obj of resultObject) {
    ipfsHash = obj.path
  }
  log.debug(`IpfsHash: ${ipfsHash}`);
  return ipfsHash;
}

async function getSchemaFromPublicIpfs(ipfsHash: string): Promise<string> {
  const ipfs = await initPublicIpfs();
  let schemaAsString: string;
  const chunks = []
  log.debug(`Get schema from public ipfs with IpfsHash: ${ipfsHash}`);
  for await (const file of ipfs.get(ipfsHash)) {
    if (!file.content) continue;
    const content = new BufferList()
    for await (const chunk of file.content) {
      content.append(chunk)
    }
    schemaAsString = content.toString();
  }
  log.debug(`Schema: ${schemaAsString}`);
  return schemaAsString;
}

async function pinSchemaInPublicIpfs(ipfsHash: string): Promise<boolean> {
  log.debug(`Pin schema with IpfsHash ${ipfsHash} in public ipfs`);
  const ipfs = await initPublicIpfs();
  try {
    await ipfs.pin.add(ipfsHash);
    return true;
  } catch (error) {
    log.error(error);
    return false;
  }
}

function validatePinEnabledOnPublicIpfs(): true | Error {
  if (!getConfig().publicIpfsConfig?.enablePin) {
    throw new Error('Pinning is not enabled!');
  }
  return true;
}

async function initPublicIpfs() {
  const publicIpfsUrl = getConfig().publicIpfsConfig.nodeUrl;
  log.debug(`Init public ipfs client: ${publicIpfsUrl}`);
  return IpfsHttpClient(publicIpfsUrl);
}

const publicIpfsService = {
  addSchemaToPublicIpfs, getSchemaFromPublicIpfs,
  validatePinEnabledOnPublicIpfs, pinSchemaInPublicIpfs
};

export default publicIpfsService;

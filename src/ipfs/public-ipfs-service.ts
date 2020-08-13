import * as IpfsHttpClient from 'ipfs-http-client';
import { getConfig } from '../schema-registry';
import { Logger } from 'tslog';

// tslint:disable: variable-name && no-var-requires
const BufferList = require('bl/BufferList')
// tslint:enable: variable-name && no-var-requires

const log: Logger = new Logger({ name: 'Public Ipfs Service' });

async function addSchemaToPublicIpfs(schemaAsString: string): Promise<string> {
  const ipfs = initPublicIpfs();
  log.debug(`Add schema to public ipfs: ${schemaAsString}`);
  const resultObject = await ipfs.add(schemaAsString);
  let ipfsHash: string;
  for await (const obj of resultObject) {
    ipfsHash = obj.path
  }
  if (getConfig().publicIpfsConfig?.enablePin) {
    log.debug(`pin schema on public ipfs: ${schemaAsString}`);
    const pinResult = await pinSchemaInPublicIpfs(ipfsHash, ipfs);
    log.debug('Schema has been pinned: ' + pinResult);
  }
  log.debug(`IpfsHash: ${ipfsHash}`);
  return ipfsHash;
}

async function getSchemaFromPublicIpfs(ipfsHash: string): Promise<string> {
  const ipfs = initPublicIpfs();
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

async function pinSchemaInPublicIpfs(ipfsHash: string, ipfs: any): Promise<boolean> {
  try {
    await ipfs.pin.add(ipfsHash);
    return true;
  } catch (error) {
    log.error(error);
    return false;
  }
}

function initPublicIpfs(): any {
  const publicIpfsUrl = getConfig().publicIpfsConfig.nodeUrl;
  log.debug(`Init public ipfs client: ${publicIpfsUrl}`);
  return IpfsHttpClient(publicIpfsUrl);
}

const publicIpfsService = {
  addSchemaToPublicIpfs, getSchemaFromPublicIpfs
};

export default publicIpfsService;

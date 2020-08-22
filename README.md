# Schema Registry DID CRUD v0.01

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

### Build library
1.  npm install
1.  npm run test
1.  npm run build

### Run unit tests
1. npm run test

### Import library in your code

* npm install @51nodes/decentralized-schema-registry

```typescript
import {initLibrary, registerSchema, getSchema, SchemaType, Network} from '@51nodes/decentralized-schema-registry'

// required configuration for the library
const configObject: ConfigObject = {
  publicIpfsConfig: {
    nodeUrl:'<ipfs node url>' // e.g. 'https://ipfs.infura.io:5001/api/v0',
    enablePin: true // the given node should support pinning (otherweise an error will be shown)
  },
  evanRuntimeConfig: {
    accountMap: {
      '<evan account Id>':'<evan private key>'
      /** WARNING: The provided evan account and private key are published on gitHub and only for example purposes,
          therefore do not use this private key in your configuration and on any network.
          Creating an evan account can be done using the evan.network dashboard
          https://dashboard.evan.network/#/dashboard.vue.evan/onboarding.vue.evan/sign-up 
          e.g. '0x8370F91b6Cdf7A15a7C48593c8Cba98C55B25e25':'50a635f2797d04e93c3c5d799099e42dbf116dcc04867ad6fbce83f1ec4cdfce'
      */
    },
    ipfs: { host: 'ipfs.evan.network', port: '443', protocol: 'https' }, // or another evan.network ipfs provider
    web3Provider: 'wss://core.evan.network/ws', // or another evan.network web3 provider
    enablePin: true // Require to have EVE balance, monthly payment (otherweise it will not be pinned, and no error will be shown)
  }
}

// a valid json schema to register
const validJsonSchema = `{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/product.schema.json",
    "title": "Item",
    "description": "A product from Acme's catalog",
    "type": "object",
    "properties": {
      "productId": {
        "description": "The unique identifier for a product",
        "type": "integer"
      },
      "productName": {
        "description": "Name of the product",
        "type": "string"
      },
    },
    "required": [ "productId", "productName" ]
  }`

// Functions

function initLibrary(configObject: ConfigObject);
// e.g. initLibrary(configObject);

async function registerSchema(schemaAsString: string, schemaType: SchemaType, network: Network);
//e.g. await registerSchema(validJsonSchema, SchemaType.JsonSchema, Network PublicIpfs);

async function getSchema(did: string);
//e.g. await getSchema('did:schema:public-ipfs:json-schema:QmY8GAAJoffVZBH1JYvta2LRZxsPaUYVQ1FGTaxwK3vV7n')

// utils function
function validateSchemaDid(did: string): boolean;
function parseSchemaDid(did: string): SchemaDid;
function stringifySchemaDid(schemaDidObject: SchemaDid): string;

```

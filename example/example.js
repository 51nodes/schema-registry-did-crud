"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addSchemaToIpfs = void 0;
var decentralized_schema_registry_1 = require("decentralized-schema-registry");
var model_1 = require("decentralized-schema-registry/dist/model");
var tslog_1 = require("tslog");
var process_1 = require("process");
var log = new tslog_1.Logger({ name: "example" });
var validJsonSchema = "{\n    \"$schema\": \"http://json-schema.org/draft-07/schema#\",\n    \"$id\": \"http://example.com/product.schema.json\",\n    \"title\": \"Item\",\n    \"description\": \"A product from Acme's catalog\",\n    \"type\": \"object\",\n    \"properties\": {\n      \"productId\": {\n        \"description\": \"The unique identifier for a product\",\n        \"type\": \"integer\"\n      },\n      \"productName\": {\n        \"description\": \"Name of the product\",\n        \"type\": \"string\"\n      },\n      \"price\": {\n        \"description\": \"The price of the product\",\n        \"type\": \"number\",\n        \"exclusiveMinimum\": 0\n      },\n      \"tags\": {\n        \"description\": \"Tags for the product\",\n        \"type\": \"array\",\n        \"items\": {\n          \"type\": \"string\"\n        },\n        \"minItems\": 1,\n        \"uniqueItems\": true\n      }\n    },\n    \"required\": [ \"productId\", \"productName\", \"price\" ]\n  }";
var configObject = {
    publicIpfsUrl: 'https://ipfs.infura.io:5001/api/v0',
    runtimeConfig: {
        accountMap: {
            '0x8370F91b6Cdf7A15a7C48593c8Cba98C55B25e25': '50a635f2797d04e93c3c5d799099e42dbf116dcc04867ad6fbce83f1ec4cdfce'
        },
        ipfs: { host: 'ipfs.evan.network', port: '443', protocol: 'https' },
        web3Provider: 'wss://core.evan.network/ws'
    }
};
function addSchemaToIpfs(schemaAsString) {
    return __awaiter(this, void 0, void 0, function () {
        var exampleDidEvan, exampleDidPublic, exampleEvanSchema, examplePublicSchema;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log.info('init Library');
                    decentralized_schema_registry_1.initLibrary(configObject);
                    log.info('configration: ');
                    log.info(decentralized_schema_registry_1.getConfig());
                    log.info('register schema in Evan IPFS');
                    return [4 /*yield*/, decentralized_schema_registry_1.registerSchema(schemaAsString, model_1.SchemaType.JsonSchema, model_1.Network.EvanIpfs)];
                case 1:
                    exampleDidEvan = _a.sent();
                    log.info('Evan IPFS DID: ' + exampleDidEvan);
                    log.info('register schema in Public IPFS');
                    return [4 /*yield*/, decentralized_schema_registry_1.registerSchema(schemaAsString, model_1.SchemaType.JsonSchema, model_1.Network.PublicIpfs)];
                case 2:
                    exampleDidPublic = _a.sent();
                    log.info('Public IPFS DID: ' + exampleDidPublic);
                    log.info('get schema under did:schema:evan-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c');
                    return [4 /*yield*/, decentralized_schema_registry_1.getSchema('did:schema:evan-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c')];
                case 3:
                    exampleEvanSchema = _a.sent();
                    log.info(exampleEvanSchema);
                    log.info('get schema under did:schema:public-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c');
                    return [4 /*yield*/, decentralized_schema_registry_1.getSchema('did:schema:public-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c')];
                case 4:
                    examplePublicSchema = _a.sent();
                    log.info(examplePublicSchema);
                    log.info('DONE!');
                    process_1.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
exports.addSchemaToIpfs = addSchemaToIpfs;
addSchemaToIpfs(validJsonSchema);

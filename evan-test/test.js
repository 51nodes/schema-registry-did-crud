const ipfsClient = require('ipfs-http-client');
const CID = require('cids')
const ipfs = ipfsClient('https://ipfs.test.evan.network'); // https://ipfs.evan.network

var fileCID;


async function crud() {

    await createFile();

    //await readFile();

    //await updateFile();

    //await removeFile();

}

async function createFile() {

    const testSchema = { path: 'test.txt', content: 'hello' };
    for await (const result of ipfs.add(testSchema)) {
        setCID(result.cid.toString());
    }

    console.log('file created: ' + fileCID)

    return fileCID

}

async function readFile() {

    console.log('reading file: ' + 'ipfs/' + fileCID)

    const chunks = []
    for await (const chunk of ipfs.files.read('ipfs/' + fileCID)) {
        chunks.push(chunk)
    }

    console.log(Buffer.concat(chunks).toString())
}

async function updateFile() {

    console.log('updating file: ' + 'ipfs/' + fileCID)

    const chunks = []
    await ipfs.files.write('/hello-world', Buffer.from('Hello, world!'))

}

async function removeFile() {

    console.log('removing file: ' + 'ipfs/' + fileCID)

    await ipfs.files.rm('ipfs/' + fileCID)

}

function setCID(hash) {

    fileCID = new CID(hash.toString())

    return fileCID

}

crud();

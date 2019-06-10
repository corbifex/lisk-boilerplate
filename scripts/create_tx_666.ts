import {APIClient} from '@liskhq/lisk-api-client';
import {initiate} from "../src/transactions";

const client = new APIClient(['http://localhost:7000']);
const passphrase = process.argv[2] || "same swamp fade drink radio fancy matter error picnic dial tone same";
client.transactions.broadcast(initiate({
    passphrase: passphrase
}))
    .then(res => {
        console.log(res.data);
    })
    .catch(e => {
        console.error(e);
    });



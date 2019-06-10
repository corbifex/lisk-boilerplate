import { constants } from '@liskhq/lisk-transactions';
import { Config } from "../../config";

const { MAX_TRANSACTION_AMOUNT, BYTESIZES } = constants;

export { InitiateTransaction } from './666_initiate_transaction';
export { initiate } from './666_initiate';

const TRANSACTION_TYPES = {
    INITIATE: 666
};
const TRANSACTION_FEES = {
    INITIATE: '1'
};
export {
    TRANSACTION_TYPES,
    TRANSACTION_FEES,
    MAX_TRANSACTION_AMOUNT,
    BYTESIZES
}

export const EPOCH_TIME = new Date(Config.app.genesisConfig.EPOCH_TIME);
export const EPOCH_TIME_MILLISECONDS = EPOCH_TIME.getTime();
const MS_FACTOR = 1000;
export const EPOCH_TIME_SECONDS = Math.floor(EPOCH_TIME.getTime() / MS_FACTOR);

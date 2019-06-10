import _ from 'lodash';
import { devnetConfig, devnetGenesisBlock } from './devnet';
import { testnetConfig, testnetGenesisBlock } from './testnet';
import { mainnetConfig, mainnetGenesisBlock } from './mainnet';
export { CONSTANTS } from './constants';

const config = {
    devnet: devnetConfig,
    testnet: testnetConfig,
    mainnet: mainnetConfig
};

const genesisBlock = {
    devnet: devnetGenesisBlock,
    testnet: testnetGenesisBlock,
    mainnet: mainnetGenesisBlock
};

let argv = process.argv[2];
if (!_.hasIn(config, argv)) {
    argv = 'devnet';
}
const chainType = argv || 'devnet';
const Config = config[chainType];
const GenesisBlock = genesisBlock[chainType];

export {
    Config,
    GenesisBlock
}

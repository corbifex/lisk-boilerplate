import { Application } from 'lisk-sdk';
import {
    InitiateTransaction, TRANSACTION_TYPES
} from './transactions';
import { Config, GenesisBlock, CONSTANTS } from '../config';
try {
    /**
     * We have to keep it in try/catch block as it can throw
     * exception while validating the configuration
     */
    const app = new Application(GenesisBlock, Config);

    app.registerTransaction(TRANSACTION_TYPES.INITIATE, InitiateTransaction);

    app.constants = {
        ...app.constants,
        ...CONSTANTS
    };

    app
        .run()
        .then(() => app.logger.info('App started...'))
        .catch(error => {
            if (error instanceof Error) {
                app.logger.error('App stopped with error', error.message);
                app.logger.debug(error.stack);
            } else {
                app.logger.error('App stopped with error', error);
            }
            process.exit();
        });
} catch (e) {
    // tslint:disable-next-line no-console
    console.error('Application start error.', e);
    process.exit();
}

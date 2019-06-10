/*
 * Copyright © 2018 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
// import { getAddressFromPublicKey } from '@liskhq/lisk-cryptography';
import { InitiateTransaction } from './666_initiate_transaction';
import { TRANSACTION_FEES, TRANSACTION_TYPES } from './index';
import { createBaseTransaction} from "./utils";
import { TransactionJSON, utils } from '@liskhq/lisk-transactions';
const {
    // validateAddress,
    // validatePublicKey,
} = utils;

export interface InitiateInputs {
    readonly passphrase?: string;
    readonly secondPassphrase?: string;
    readonly timeOffset?: number;
}


export const initiate = (inputs: InitiateInputs): Partial<TransactionJSON> => {
    // validateInputs(inputs);
    const {
        passphrase,
        secondPassphrase,
    } = inputs;


    const transaction = {
        ...createBaseTransaction(inputs),
        fee: TRANSACTION_FEES.INITIATE.toString(),
        type: TRANSACTION_TYPES.INITIATE,
    };
    delete transaction.amount;

    if (!passphrase) {
        return transaction;
    }

    const transactionWithSenderInfo = {
        ...transaction,
        senderId: transaction.senderId as string,
        senderPublicKey: transaction.senderPublicKey as string,
    };

    const initiateTransaction = new InitiateTransaction(
        transactionWithSenderInfo,
    );
    initiateTransaction.sign(passphrase, secondPassphrase);

    return initiateTransaction.toJSON();
};

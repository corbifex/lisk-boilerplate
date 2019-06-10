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
import BigNum from '@liskhq/bignum';
import {
    BaseTransaction,
    convertToAssetError,
    StateStore,
    StateStorePrepare,
    TransactionError,
    TransactionJSON,
    utils,
} from '@liskhq/lisk-transactions';
import { TRANSACTION_FEES } from './index';
const {
    validator,
} = utils;

export interface InitiateAsset {
    readonly initiate: boolean;
}

export const initiateAssetFormatSchema = {
    type: 'object',
    properties: {
        initiate: {
            type: 'number',
            maxLength: 1,
        },
    },
};

export class InitiateTransaction extends BaseTransaction {
    public readonly asset: InitiateAsset;
    public static TYPE = 666;

    public constructor(rawTransaction) {
        super(rawTransaction);
        const tx = (typeof rawTransaction === 'object' && rawTransaction !== null
            ? rawTransaction
            : {}) as Partial<TransactionJSON>;
        // Initializes to empty object if it doesn't exist
        this.asset = (tx.asset || {initiate: 1}) as InitiateAsset;
    }

    protected assetToBytes(): Buffer {
        return Buffer.alloc(1);
    }

    public assetToJSON(): InitiateAsset {
        return this.asset;
    }

    public async prepare(store: StateStorePrepare): Promise<void> {
        await store.transaction.cache([
            {
                senderId: this.senderId,
            }
        ]);

        await store.account.cache([
            {
                address: this.senderId,
            }
        ]);
    }

    // tslint:disable-next-line prefer-function-over-method
    protected verifyAgainstTransactions(
        _: ReadonlyArray<TransactionJSON>,
    ): ReadonlyArray<TransactionError> {
        return [];
    }

    protected validateAsset(): ReadonlyArray<TransactionError> {
        const errors = convertToAssetError(
            this.id,
            validator.errors,
        ) as TransactionError[];
        if (this.type !== InitiateTransaction.TYPE) {
            errors.push(
                new TransactionError(
                    'Invalid type',
                    this.id,
                    '.type',
                    this.type,
                    InitiateTransaction.TYPE,
                ),
            );
        }

        if (!this.fee.eq(TRANSACTION_FEES.INITIATE)) {
            errors.push(
                new TransactionError(
                    `Fee must be equal to ${TRANSACTION_FEES.INITIATE}`,
                    this.id,
                    '.fee',
                    this.fee.toString(),
                    TRANSACTION_FEES.INITIATE,
                ),
            );
        }

        return errors;
    }

    protected applyAsset(store: StateStore): ReadonlyArray<TransactionError> {
        const errors: TransactionError[] = [];
        const sender = store.account.get(this.senderId);

        const alreadyInitiated = store.transaction.find(
            (transaction: TransactionJSON) =>
                transaction.senderId === this.senderId
        );
        if (alreadyInitiated) {
            errors.push(
                new TransactionError(
                    `This account is already initiated: ${sender.publicKey}`,
                    this.id,
                    sender.publicKey
                )
            );
        }

        const balanceError = utils.verifyAmountBalance(
            this.id,
            sender,
            new BigNum('0'),
            this.fee
        );
        if (balanceError) {
            errors.push(balanceError);
        }

        const updatedSenderBalance = new BigNum(sender.balance).add('1');

        const updatedSender = {
            ...sender,
            balance: updatedSenderBalance.toString(),
        };
        store.account.set(updatedSender.address, updatedSender);

        return errors;
    }

    protected undoAsset(store: StateStore): ReadonlyArray<TransactionError> {
        const errors: TransactionError[] = [];
        const sender = store.account.get(this.senderId);
        const updatedSenderBalance = new BigNum(sender.balance).sub('1');

        const updatedSender = {
            ...sender,
            balance: updatedSenderBalance.toString(),
        };
        store.account.set(updatedSender.address, updatedSender);

        return errors;
    }

    // tslint:disable:next-line: prefer-function-over-method no-any
    protected assetFromSync(raw: any): object | undefined {
        if (raw.tf_data) {
            // This line will throw if there is an error
            const data = raw.tf_data.toString('utf8');

            return { data };
        }

        return undefined;
    }
}

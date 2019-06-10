import { EPOCH_TIME_MILLISECONDS } from '../index';

const MS_TIME = 1000;

export const getTimeFromBlockchainEpoch = (givenTimestamp?: number): number => {
    const startingPoint = givenTimestamp || new Date().getTime();
    const blockchainInitialTime = EPOCH_TIME_MILLISECONDS;

    return Math.floor((startingPoint - blockchainInitialTime) / MS_TIME);
};

export const getTimeWithOffset = (offset?: number): number => {
    const now = new Date().getTime();
    const timeWithOffset = offset ? now + offset * MS_TIME : now;

    return getTimeFromBlockchainEpoch(timeWithOffset);
}

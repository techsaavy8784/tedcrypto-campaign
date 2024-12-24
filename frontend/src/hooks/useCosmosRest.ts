import { useState } from 'react';
import axios from 'axios';
import { Coin } from '@cosmjs/amino';
import { getExponentByDenom } from '../utils/chain';
import { shiftDigits } from "../utils/calc";
import dayjs from 'dayjs';

export interface Delegation {
    validatorName: string;
    validatorAddress: string;
    amount: Coin;
    displayAmount: string;
}

export interface Grant {
    granter: string;
    grantee: string;
    authorization: {
        '@type': string;
        max_tokens: {
            amount: string;
            denom: string;
        };
        allow_list?: {
            address: string[];
        };
    };
    expiration: string;
}

export interface Supporter {
    wallet: string;
    amount: Coin;
    expiration: string;
}

export function useCosmosRest() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getDelegations = async (chainName: string, address: string): Promise<Delegation[]> => {
        setIsLoading(true);
        setError(null);

        try {
            // Get delegations
            const delegationsResponse = await axios.get(
                `https://rest.cosmos.directory/${chainName}/cosmos/staking/v1beta1/delegations/${address}`
            );

            if (!delegationsResponse.data?.delegation_responses) {
                return [];
            }

            // Get validators info for names
            const validatorsResponse = await axios.get(
                `https://rest.cosmos.directory/${chainName}/cosmos/staking/v1beta1/validators?pagination.limit=10000`
            );

            const validatorsMap = new Map(
                validatorsResponse.data.validators.map((validator: any) => [
                    validator.operator_address,
                    validator.description.moniker
                ])
            );

            return delegationsResponse.data.delegation_responses.map((delegation: any) => {
                const exponent = getExponentByDenom(delegation.balance.denom);

                return {
                    validatorName: validatorsMap.get(delegation.delegation.validator_address) || delegation.delegation.validator_address,
                    validatorAddress: delegation.delegation.validator_address,
                    amount: delegation.balance,
                    displayAmount: shiftDigits(delegation.balance.amount, -exponent)
                };
            });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch delegations';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getGrants = async (chainName: string, address: string, grantee?: string): Promise<Grant[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `https://rest.cosmos.directory/${chainName}/cosmos/authz/v1beta1/grants/granter/${address}`
            );

            if (!response.data?.grants) {
                return [];
            }

            let grants = response.data.grants;

            // Filter by grantee if provided
            if (grantee) {
                grants = grants.filter((grant: Grant) => grant.grantee === grantee);
            }

            return grants;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch grants';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getGrantsByGrantee = async (chainName: string, address: string, grantee: string): Promise<Grant[]> => {
        return getGrants(chainName, address, grantee);
    };

    const getSupporters = async (chainName: string, campaignWalletAddress: string): Promise<Supporter[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `https://rest.cosmos.directory/${chainName}/cosmos/authz/v1beta1/grants/grantee/${campaignWalletAddress}?pagination.limit=10`
            );

            if (!response.data?.grants) {
                return [];
            }

            return response.data.grants
                .filter((grant: Grant) =>
                    grant.authorization['@type'] === '/cosmos.staking.v1beta1.StakeAuthorization' &&
                    grant.authorization.max_tokens
                )
                .map((grant: Grant) => ({
                    wallet: grant.granter,
                    amount: grant.authorization.max_tokens,
                    expiration: grant.expiration
                }))
                .sort((a: Supporter, b: Supporter) =>
                    dayjs(b.expiration).unix() - dayjs(a.expiration).unix()
                );
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch supporters';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        getDelegations,
        getGrants,
        getGrantsByGrantee,
        getSupporters,
        isLoading,
        error
    };
}
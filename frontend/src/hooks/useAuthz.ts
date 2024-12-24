import { closeSnackbar, enqueueSnackbar } from "notistack";
import { MsgRevoke, MsgGrant } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { AuthorizationType, StakeAuthorization } from "cosmjs-types/cosmos/staking/v1beta1/authz";
import { handleTransaction, isSuccess } from "../components/Shared/Utils";
import { useChain } from "@cosmos-kit/react";
import { Campaign } from "../types/Campaign";
import { useGrantApi } from "./useGrantApi";
import { coin } from "@cosmjs/amino";
import dayjs from "dayjs";

export function useAuthz(campaign: Campaign) {
    const {
        signAndBroadcast,
        address,
    } = useChain(campaign.chainName);
    const { createGrant: apiCreateGrant, revokeGrant: apiRevokeGrant } = useGrantApi();

    const createGrant = async (amount: number, denom: string) => {
        const snackbarKey = enqueueSnackbar('Signing and broadcasting grant transaction... please wait', { variant: 'info', persist: true });
        try {
            const expiryDate = dayjs().add(1, 'year').toDate();
            const maxTokens = coin(amount.toString(), denom);

            const result = await signAndBroadcast(
                [{
                    typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
                    value: MsgGrant.fromPartial({
                        granter: address,
                        grantee: campaign.campaignWalletAddress,
                        grant: {
                            authorization: {
                                typeUrl: "/cosmos.staking.v1beta1.StakeAuthorization",
                                value: StakeAuthorization.encode(StakeAuthorization.fromPartial({
                                    maxTokens: maxTokens,
                                    allowList: {
                                        address: [campaign.validator]
                                    },
                                    authorizationType: AuthorizationType.AUTHORIZATION_TYPE_REDELEGATE
                                })).finish()
                            },
                            expiration: {
                                seconds: BigInt((expiryDate.getTime() / 1000).toFixed()),
                                nanos: 0
                            }
                        }
                    })
                }],
                undefined,
                "Create campaign grant"
            );

            await handleTransaction(result, 'Successfully created grant!');
            if (isSuccess(result)) {
                await apiCreateGrant(campaign.id, address ?? '', maxTokens.amount, result.transactionHash);
            }
            return result;
        } catch (error) {
            console.error('Error creating grant:', error);
            enqueueSnackbar('Failed to create grant. Please try again.', { variant: 'error' });
            throw error;
        } finally {
            closeSnackbar(snackbarKey);
        }
    };

    const revokeGrant = async () => {
        const snackbarKey = enqueueSnackbar('Signing and broadcasting revoke transaction... please wait', { variant: 'info', persist: true });
        try {
            const result = await signAndBroadcast(
                [{
                    typeUrl: "/cosmos.authz.v1beta1.MsgRevoke",
                    value: MsgRevoke.fromPartial({
                        granter: address,
                        grantee: campaign.campaignWalletAddress,
                        msgTypeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate'
                    })
                }],
                undefined,
                "Revoke campaign grant"
            );

            await handleTransaction(result, 'Successfully revoked grant!');
            isSuccess(result) && apiRevokeGrant(campaign.id);
        } catch (error) {
            console.error('Error revoking grant:', error);
            enqueueSnackbar('Failed to revoke grant. Please try again.', { variant: 'error' });
        } finally {
            closeSnackbar(snackbarKey);
        }
    };

    return { createGrant, revokeGrant };
}
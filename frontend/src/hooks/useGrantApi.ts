import {useApi} from "../context/ApiProvider";

export function useGrantApi() {
    const api = useApi();

    const createGrant = async (campaignId: string, wallet: string, tokens: string, txHash: string): Promise<void> => {
        await api?.post("/grant", {
            campaignId: campaignId,
            wallet: wallet,
            tokens: tokens,
            txHash: txHash,
        })
    }

    const revokeGrant = (id: string) => {
        api?.delete(`/grant/${id}`)
            .catch((error) => {
                console.error("Error:", error);
            })
    }

    return {
        createGrant,
        revokeGrant,
    }
}
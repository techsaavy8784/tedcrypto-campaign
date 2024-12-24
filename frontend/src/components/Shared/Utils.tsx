import {Button} from "@mui/material";
import {enqueueSnackbar} from "notistack";
import React from "react";

export const isSuccess = (txResult: any) => txResult.code === 0;

export const handleTransaction = async (txResult: any, successMessage: string) => {
    const txHash = txResult.transactionHash;
    const action = txHash ? () => (
        <Button
            color="inherit"
            onClick={() => window.open(`https://www.mintscan.io/cosmos/tx/${txHash}`, '_blank')}
        >
            View
        </Button>
    ) : undefined;

    if (isSuccess(txResult)) {
        enqueueSnackbar(successMessage, { variant: 'success', action });
        // Refresh grants after successful transaction
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } else {
        enqueueSnackbar('Transaction failed. Please try again.', { variant: 'error', action });
    }
};
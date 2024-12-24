import React from "react";
import { Box, Button, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { getExponent, getTokenByChainName } from "../../utils/chain";
import { shiftDigits } from "../../utils/calc";
import { useAuthz } from "../../hooks/useAuthz";
import {Campaign} from "../../types/Campaign";
import {enqueueSnackbar} from "notistack";

interface GrantFormProps {
    campaign: Campaign;
    isEditing: boolean;
    onSuccess: () => void;
    onCancel: () => void;
    presetAmount: number;
}

const GrantForm: React.FC<GrantFormProps> = ({ campaign, isEditing, onSuccess, onCancel, presetAmount }) => {
    const { createGrant } = useAuthz(campaign);

    const createOrUpdateGrant = async () => {
        if (!presetAmount || presetAmount <= 0) {
            enqueueSnackbar('Please select validators and amount to commit', { variant: 'error' });
            return;
        }

        try {
            const token = getTokenByChainName(campaign.chainName);
            const exponent = getExponent(campaign.chainName);
            const amount = shiftDigits(presetAmount, exponent);

            await createGrant(Number(amount), token.base);
            onSuccess();
        } catch (error) {
            console.error('Error during grant creation:', error);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
                {isEditing
                    ? 'Update your support amount. This will replace your existing grant.'
                    : 'Support our validator by committing your tokens. Your tokens remain under your control and will only be staked when the campaign succeeds.'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                {isEditing && (
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        sx={{
                            flex: 1,
                            borderColor: 'rgba(255,255,255,0.3)',
                            color: '#fff',
                            '&:hover': {
                                borderColor: '#fff',
                                bgcolor: 'rgba(255,255,255,0.1)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={createOrUpdateGrant}
                    endIcon={<SendIcon />}
                    fullWidth
                    disabled={!presetAmount || presetAmount <= 0}
                    sx={{
                        flex: 1,
                        bgcolor: '#ff4081',
                        '&:hover': {
                            bgcolor: '#ff1c6e'
                        },
                        '&.Mui-disabled': {
                            bgcolor: 'rgba(255,64,129,0.3)',
                            color: 'rgba(255,255,255,0.5)'
                        },
                        color: '#fff',
                        py: 1.5
                    }}
                >
                    {isEditing ? 'Update Support' : 'Commit to Campaign'}
                </Button>
            </Box>
        </Box>
    );
};

export default GrantForm;
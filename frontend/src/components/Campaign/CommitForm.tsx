import React, { useEffect, useState } from "react";
import { Box, Slider, Typography, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { enqueueSnackbar } from 'notistack';
import { useChain } from "@cosmos-kit/react";
import { motion, AnimatePresence } from "framer-motion";
import ConnectWallet from "../Wallet/ConnectWallet";
import TitledContainer from "../Shared/TitledContainer";
import HandshakeIcon from '@mui/icons-material/Handshake';
import GrantDetails, { Grant } from "./GrantDetails";
import GrantForm from "./GrantForm";
import { Campaign } from "../../types/Campaign";
import Loading from "../Shared/Loading";
import { useAuthz } from "../../hooks/useAuthz";
import { useCosmosRest, Delegation } from "../../hooks/useCosmosRest";
import { formatTokenAmount } from "../../utils/chain";

const CommitForm: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const { revokeGrant } = useAuthz(campaign);
    const [currentGrant, setCurrentGrant] = useState<Grant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [delegations, setDelegations] = useState<Delegation[]>([]);
    const [selectedDelegations, setSelectedDelegations] = useState<string[]>([]);
    const [commitAmount, setCommitAmount] = useState<number>(0);
    const [maxAmount, setMaxAmount] = useState<number>(0);

    const { wallet, address, status } = useChain(campaign.chainName);
    const { getDelegations, getGrantsByGrantee } = useCosmosRest();

    useEffect(() => {
        const fetchData = async () => {
            if (status === "Connected" && address) {
                setIsLoading(true);
                try {
                    // Fetch delegations
                    const delegationsData = await getDelegations(campaign.chainName, address);
                    const filteredDelegations = delegationsData.filter(
                        delegation => Number(delegation.displayAmount) >= 0.001 && delegation.validatorAddress !== campaign.validator
                    );
                    setDelegations(filteredDelegations);

                    // Fetch grants
                    const grants = await getGrantsByGrantee(campaign.chainName, address, campaign.campaignWalletAddress);
                    setCurrentGrant(grants[0] || null);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    enqueueSnackbar('Failed to fetch current data', { variant: 'error' });
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [address, status, campaign.campaignWalletAddress, campaign.chainName]);

    useEffect(() => {
        const totalAmount = selectedDelegations.reduce((sum, validatorAddr) => {
            const delegation = delegations.find(d => d.validatorAddress === validatorAddr);
            if (delegation?.amount.amount === undefined || delegation?.amount.amount === null || Number(delegation?.amount.amount) < 0.000001) {
                return sum;
            }

            return sum + (delegation ? Number(delegation.displayAmount) : 0);
        }, 0);
        setMaxAmount(totalAmount);
        setCommitAmount(totalAmount);
    }, [selectedDelegations, delegations]);

    const handleDelegationToggle = (validatorAddress: string) => {
        setSelectedDelegations(prev => {
            if (prev.includes(validatorAddress)) {
                return prev.filter(addr => addr !== validatorAddress);
            } else {
                return [...prev, validatorAddress];
            }
        });
    };

    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        setCommitAmount(newValue as number);
    };

    return (
        <TitledContainer title="Campaign Commitment" icon={<HandshakeIcon sx={{ fontSize: 24, color: '#ff4081' }} />}>
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <Loading />
                ) : !wallet ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <ConnectWallet chainName={campaign.chainName} />
                        </Box>
                    </motion.div>
                ) : currentGrant && !isEditing ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <GrantDetails
                            currentGrant={currentGrant}
                            onEdit={() => setIsEditing(true)}
                            onRevoke={revokeGrant}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                                Select Validators to Redelegate From
                            </Typography>
                            <FormGroup>
                                {delegations.map((delegation) => (
                                    <FormControlLabel
                                        key={delegation.validatorAddress}
                                        control={
                                            <Checkbox
                                                checked={selectedDelegations.includes(delegation.validatorAddress)}
                                                onChange={() => handleDelegationToggle(delegation.validatorAddress)}
                                                sx={{
                                                    color: 'rgba(255,255,255,0.7)',
                                                    '&.Mui-checked': {
                                                        color: '#ff4081',
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography sx={{ color: '#fff' }}>
                                                {delegation.validatorName} ({formatTokenAmount(delegation.amount)})
                                            </Typography>
                                        }
                                    />
                                ))}
                            </FormGroup>

                            {selectedDelegations.length > 0 && (
                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
                                        Amount to Commit
                                    </Typography>
                                    <Slider
                                        value={commitAmount}
                                        onChange={handleSliderChange}
                                        min={0}
                                        max={maxAmount}
                                        step={0.000001}
                                        valueLabelDisplay="auto"
                                        sx={{
                                            color: '#ff4081',
                                            '& .MuiSlider-thumb': {
                                                backgroundColor: '#ff4081',
                                            },
                                            '& .MuiSlider-track': {
                                                backgroundColor: '#ff4081',
                                            },
                                            '& .MuiSlider-rail': {
                                                backgroundColor: 'rgba(255,255,255,0.3)',
                                            },
                                        }}
                                    />
                                    <Typography sx={{ color: '#fff', mt: 1 }}>
                                        Selected Amount: {commitAmount.toFixed(6)}
                                    </Typography>
                                </Box>
                            )}

                            <GrantForm
                                campaign={campaign}
                                isEditing={isEditing}
                                onSuccess={() => {
                                    setIsEditing(false);
                                    window.location.reload();
                                }}
                                onCancel={() => setIsEditing(false)}
                                presetAmount={commitAmount}
                            />
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </TitledContainer>
    );
};

export default CommitForm;
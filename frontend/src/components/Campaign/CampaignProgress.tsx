import React, {useEffect} from 'react';
import {
    Box,
    Typography,
    Grid,
    Avatar,
    Chip,
    CircularProgress,
    keyframes,
} from '@mui/material';
import { Campaign } from '../../types/Campaign';
import TitledContainer from '../Shared/TitledContainer';
import RocketIcon from '@mui/icons-material/Rocket';
import { getTokenByChainName } from '../../utils/chain';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';
import PerkCards from './PerkCards';

const pulse = keyframes`
    0% {
        transform: scale(1);
        opacity: 0.8;
    }
    50% {
        transform: scale(1.05);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 0.8;
    }
`;

const CampaignProgress: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const [progressPercentage, setProgressPercentage] = React.useState<number>(0);

    useEffect(() => {
        const percentage = Math.min(
            100,
            Math.max(
                0,
                Number((Number(campaign.currentAmount) / Number(campaign.targetAmount) * 100).toFixed(2))
            )
        )
        console.log('percentage', percentage);
        setProgressPercentage(percentage);
    }, [campaign]);

    const denom = getTokenByChainName(campaign.chainName);

    if (!campaign) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress sx={{ color: '#ff4081' }} />
            </Box>
        );
    }

    return (
        <TitledContainer
            title={campaign.name}
            icon={<RocketIcon sx={{ fontSize: 24, color: '#ff4081' }} />}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ position: 'relative', overflow: 'hidden' }} paddingTop={1}>
                    {/* Validator Info */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        >
                            <Avatar
                                src={campaign.validatorImage}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    margin: '0 auto',
                                    border: '3px solid #ff4081',
                                    animation: `${pulse} 3s infinite ease-in-out`,
                                }}
                            />
                        </motion.div>
                        <Typography variant="h4" sx={{ mt: 2, fontWeight: 700, color: '#fff' }}>
                            {campaign.validatorName}
                        </Typography>
                        <Chip
                            label={campaign.validator}
                            sx={{
                                mt: 1,
                                bgcolor: 'rgba(255, 64, 129, 0.1)',
                                color: '#ff4081',
                                borderRadius: '8px',
                                '&:hover': { bgcolor: 'rgba(255, 64, 129, 0.2)' },
                            }}
                        />
                    </Box>

                    {/* Progress Section */}
                    <Box sx={{ mt: 6, mb: 4 }}>
                        <ProgressBar progress={progressPercentage} />
                    </Box>

                    {/* Stats */}
                    <Grid container spacing={3} sx={{ textAlign: 'center', mt: 2, mb: 6 }}>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 3,
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Current Amount
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#ff4081', fontWeight: 700 }}>
                                    {campaign.currentAmount} ${denom.symbol}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 3,
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Target Amount
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                                    {campaign.targetAmount} ${denom.symbol}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Perks Section */}
                    <PerkCards progress={progressPercentage} />
                </Box>
            </motion.div>
        </TitledContainer>
    );
};

export default CampaignProgress;
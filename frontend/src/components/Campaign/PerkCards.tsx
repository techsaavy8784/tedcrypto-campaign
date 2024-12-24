import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import PercentIcon from '@mui/icons-material/Percent';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import StarsIcon from '@mui/icons-material/Stars';

interface PerkCardsProps {
    progress: number;
}

const perks = [
    {
        threshold: 0,
        nextThreshold: 20,
        title: '100% Commission Refund',
        description: 'Get all your validator commission fees refunded while this tier is active',
        icon: <CurrencyExchangeIcon sx={{ fontSize: 40, color: '#ff4081' }} />,
        highlight: '100% REFUND',
    },
    {
        threshold: 20,
        nextThreshold: 50,
        title: '50% Commission Refund',
        description: 'Receive half of your validator commission fees back during this period',
        icon: <PercentIcon sx={{ fontSize: 40, color: '#ff4081' }} />,
        highlight: '50% REFUND',
    },
    {
        threshold: 50,
        nextThreshold: 80,
        title: '2x TedLotto Tickets',
        description: 'Double tickets or 50% discount on TedLotto for your delegated campaign amount',
        icon: <LocalActivityIcon sx={{ fontSize: 40, color: '#ff4081' }} />,
        highlight: '2X TICKETS',
    },
    {
        threshold: 80,
        nextThreshold: 100,
        title: '1.5x TedLotto Bonus',
        description: '50% extra tickets on TedLotto for your delegated campaign amount',
        icon: <StarsIcon sx={{ fontSize: 40, color: '#ff4081' }} />,
        highlight: '1.5X BONUS',
    },
];

const PerkCards: React.FC<PerkCardsProps> = ({ progress }) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#fff', fontWeight: 700 }}>
                Active Campaign Rewards
            </Typography>
            <Grid container spacing={3}>
                {perks.map((perk, index) => {
                    const isUnlocked = progress >= perk.threshold && progress < perk.nextThreshold;
                    const isPassed = progress >= perk.nextThreshold;

                    return (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Paper
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        bgcolor: isUnlocked
                                            ? 'rgba(255, 64, 129, 0.15)'
                                            : isPassed
                                                ? 'rgba(255, 255, 255, 0.05)'
                                                : 'rgba(0, 0, 0, 0.3)',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        border: isUnlocked
                                            ? '1px solid rgba(255, 64, 129, 0.5)'
                                            : '1px solid rgba(255, 255, 255, 0.1)',
                                        '&:hover': isUnlocked ? {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 20px rgba(255, 64, 129, 0.2)',
                                        } : {},
                                    }}
                                >
                                    {/* Status Indicator */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            color: isPassed ? '#757575' : isUnlocked ? '#4caf50' : '#757575',
                                        }}
                                    >
                                        {isPassed ? (
                                            <BlockIcon />
                                        ) : isUnlocked ? (
                                            <CheckCircleIcon />
                                        ) : (
                                            <LockIcon />
                                        )}
                                    </Box>

                                    {/* Progress Range */}
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            left: 16,
                                            color: isUnlocked ? '#4caf50' : '#757575',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {perk.threshold}% - {perk.nextThreshold}%
                                    </Typography>

                                    {/* Perk Content */}
                                    <Box sx={{
                                        mt: 4,
                                        mb: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        opacity: isUnlocked ? 1 : 0.5
                                    }}>
                                        {perk.icon}
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 1,
                                            color: isUnlocked ? '#ff4081' : 'rgba(255,255,255,0.5)',
                                            fontWeight: 600,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {perk.highlight}
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 1,
                                            color: isUnlocked ? '#fff' : 'rgba(255,255,255,0.5)',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {perk.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: isUnlocked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                                        }}
                                    >
                                        {perk.description}
                                    </Typography>

                                    {/* Status Text */}
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            mt: 2,
                                            textAlign: 'center',
                                            color: isUnlocked ? '#4caf50' : '#757575',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {isUnlocked ? (
                                            '🎉 ACTIVE NOW'
                                        ) : progress < perk.threshold ? (
                                            `Unlocks at ${perk.threshold}%`
                                        ) : (
                                            'No longer available'
                                        )}
                                    </Typography>

                                    {/* Passed Overlay */}
                                    {isPassed && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                bgcolor: 'rgba(0,0,0,0.7)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: '#757575',
                                                    fontWeight: 700,
                                                    fontSize: '1.2rem',
                                                    transform: 'rotate(-45deg)',
                                                    border: '2px solid #757575',
                                                    padding: '4px 20px',
                                                }}
                                            >
                                                ENDED
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </motion.div>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default PerkCards;
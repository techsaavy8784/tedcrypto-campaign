import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import HandshakeIcon from '@mui/icons-material/Handshake';
import StarIcon from '@mui/icons-material/Star';
import SecurityIcon from '@mui/icons-material/Security';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const StepsWithNumbers: React.FC = () => {
    const steps = [
        {
            title: "Join the Campaign",
            description: "Support our validator by pledging your tokens. Early supporters get access to exclusive rewards and benefits.",
            icon: <HandshakeIcon sx={{ fontSize: 32, color: '#ff4081' }} />,
        },
        {
            title: "Claim Better Rewards",
            description: "The earlier you join, the better the rewards. From commission refunds to bonus TedLotto tickets - don't miss out!",
            icon: <StarIcon sx={{ fontSize: 32, color: '#ff4081' }} />,
        },
        {
            title: "Secure Permission",
            description: "Safely authorize token delegation. Your assets remain under your control - we only stake when the campaign succeeds.",
            icon: <SecurityIcon sx={{ fontSize: 32, color: '#ff4081' }} />,
        },
        {
            title: "Automatic Staking",
            description: "Once we reach our goal, your tokens will be automatically staked. Start earning rewards immediately!",
            icon: <AutoAwesomeIcon sx={{ fontSize: 32, color: '#ff4081' }} />,
        }
    ];

    return (
        <Box sx={{ mt: 8, mb: 4 }}>
            <Typography
                variant="h4"
                sx={{
                    textAlign: "center",
                    mb: 6,
                    color: '#fff',
                    fontWeight: 700,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
            >
                How It Works
            </Typography>
            <Grid container spacing={4}>
                {steps.map((step, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px',
                                    p: 3,
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        left: 16,
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(255, 64, 129, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ff4081',
                                        fontWeight: 700,
                                        fontSize: '1.2rem',
                                    }}
                                >
                                    {index + 1}
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mb: 2,
                                        mt: 4
                                    }}
                                >
                                    {step.icon}
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        textAlign: "center",
                                        mb: 2,
                                        color: '#fff',
                                        fontWeight: 600
                                    }}
                                >
                                    {step.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        textAlign: "center",
                                        color: 'rgba(255,255,255,0.7)',
                                        lineHeight: 1.6
                                    }}
                                >
                                    {step.description}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default StepsWithNumbers;
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    const markers = [0, 25, 50, 75, 100];

    return (
        <Box sx={{ position: 'relative', width: '95%' }} marginLeft={3}>
            {/* Progress Bar */}
            <Box
                sx={{
                    height: '12px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #ff4081 0%, #ff6b9c 100%)',
                        boxShadow: '0 0 20px rgba(255, 64, 129, 0.5)',
                        position: 'relative',
                    }}
                />
            </Box>

            {/* Markers */}
            <Box sx={{ position: 'relative', mt: 1 }} marginLeft={1.3}>
                {markers.map((marker) => (
                    <Box
                        key={marker}
                        sx={{
                            position: 'absolute',
                            left: `${marker}%`,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <Box
                            sx={{
                                width: '2px',
                                height: '8px',
                                bgcolor: marker <= progress ? '#ff4081' : 'rgba(255,255,255,0.3)',
                                mb: 1,
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{
                                color: marker <= progress ? '#ff4081' : 'rgba(255,255,255,0.5)',
                                fontWeight: marker <= progress ? 700 : 400,
                            }}
                        >
                            {marker}%
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Current Progress Label */}
            <Typography
                variant="h6"
                sx={{
                    position: 'absolute',
                    top: -40,
                    left: `${progress}%`,
                    transform: 'translateX(-50%)',
                    color: '#ff4081',
                    fontWeight: 700,
                    textShadow: '0 0 10px rgba(255, 64, 129, 0.3)',
                }}
            >
                {progress.toFixed(1)}%
            </Typography>
        </Box>
    );
};

export default ProgressBar;
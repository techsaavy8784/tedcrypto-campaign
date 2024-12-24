import React from 'react';
import { Box, IconButton, Tooltip, Zoom } from '@mui/material';
import { motion } from 'framer-motion';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import CasinoIcon from '@mui/icons-material/Casino';

const SocialLinks: React.FC = () => {
    const links = [
        {
            name: 'Website',
            icon: <LanguageIcon />,
            url: 'https://tedcrypto.io',
            color: '#3f51b5'
        },
        {
            name: 'Telegram',
            icon: <TelegramIcon />,
            url: 'http://telegram.tedcrypto.io',
            color: '#0088cc'
        },
        {
            name: 'TedLotto',
            icon: <CasinoIcon />,
            url: 'https://lotto.tedcrypto.io',
            color: '#ff4081'
        }
    ];

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 1000,
                display: 'flex',
                gap: 1,
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '8px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            {links.map((link, index) => (
                <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                >
                    <Tooltip
                        title={link.name}
                        placement="bottom"
                        TransitionComponent={Zoom}
                        arrow
                    >
                        <IconButton
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: link.color,
                                    transform: 'scale(1.1)',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            {link.icon}
                        </IconButton>
                    </Tooltip>
                </motion.div>
            ))}
        </Box>
    );
};

export default SocialLinks;
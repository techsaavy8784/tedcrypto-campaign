import React from 'react';
import { useChain } from '@cosmos-kit/react';
import { Button } from '@mui/material';

const ConnectWallet: React.FC<{ chainName: string }> = ({ chainName }) => {
    const { connect, disconnect, status, address } = useChain(chainName);

    const handleConnect = async () => {
        if (status === 'Disconnected') {
            await connect();
        } else {
            await disconnect();
        }
    };

    return (
        <Button
            variant="contained"
            color={status === 'Connected' ? 'secondary' : 'primary'}
            onClick={handleConnect}
            sx={{ bgcolor: status === 'Connected' ? '#ff4081' : '#3f51b5', '&:hover': { bgcolor: status === 'Connected' ? '#ff1c6e' : '#303f9f' } }}
        >
            {status === 'Connected' ? `Disconnect (${address?.slice(0, 6)}...${address?.slice(-4)})` : 'Connect Wallet'}
        </Button>
    );
};

export default ConnectWallet;

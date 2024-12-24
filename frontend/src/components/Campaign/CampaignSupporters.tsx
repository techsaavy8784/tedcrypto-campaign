import React, {useEffect, useState} from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatTokenAmount } from '../../utils/chain';
import TitledContainer from '../Shared/TitledContainer';
import GroupIcon from '@mui/icons-material/Group';
import Loading from '../Shared/Loading';
import {Supporter, useCosmosRest} from '../../hooks/useCosmosRest';
import {Campaign} from "../../types/Campaign";

dayjs.extend(relativeTime);

interface CampaignSupportersProps {
    campaign: Campaign;
}

const CampaignSupporters: React.FC<CampaignSupportersProps> = ({campaign }) => {
    const {getSupporters} = useCosmosRest();
    const [supporters, setSupporters] = useState<Supporter[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const formatWalletAddress = (address: string) => {
        return `${address.slice(0, 8)}...${address.slice(-8)}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supporters = await getSupporters(campaign.chainName, campaign.campaignWalletAddress);
                setSupporters(supporters);
            } catch (error) {
                console.error('Error fetching supporters:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [campaign]);

    if (isLoading) {
        return (
            <TitledContainer title="Recent Supporters" icon={<GroupIcon sx={{ fontSize: 24, color: '#ff4081' }} />}>
                <Loading />
            </TitledContainer>
        );
    }

    return (
        <TitledContainer title="Recent Supporters" icon={<GroupIcon sx={{ fontSize: 24, color: '#ff4081' }} />}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <TableContainer
                    component={Paper}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#ff4081', fontWeight: 600 }}>Wallet</TableCell>
                                <TableCell sx={{ color: '#ff4081', fontWeight: 600 }}>Amount</TableCell>
                                <TableCell sx={{ color: '#ff4081', fontWeight: 600 }}>Expiration</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {supporters
                                .slice(0, 10)
                                .map((supporter, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                            },
                                        }}
                                    >
                                        <TableCell sx={{color: '#fff'}}>
                                            {formatWalletAddress(supporter.wallet)}
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff' }}>
                                            {formatTokenAmount(supporter.amount)}
                                        </TableCell>
                                        <TableCell sx={{ color: '#fff' }}>
                                            <Tooltip title={dayjs(supporter.expiration).format('YYYY-MM-DD HH:mm:ss')}>
                                                <span>{dayjs(supporter.expiration).fromNow()}</span>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {supporters.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ textAlign: 'center', color: '#fff' }}>
                                        <Typography variant="body1">
                                            No supporters yet. Be the first to support!
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </motion.div>
        </TitledContainer>
    );
};

export default CampaignSupporters;
import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { formatTokenAmount } from "../../utils/chain";

export interface Grant {
    grantee: string;
    authorization: {
        '@type': string;
        max_tokens: {
            amount: string;
            denom: string;
        };
    };
    expiration: string;
}

interface GrantDetailsProps {
    currentGrant: Grant;
    onEdit: () => void;
    onRevoke: () => void;
}

const GrantDetails: React.FC<GrantDetailsProps> = ({ currentGrant, onEdit, onRevoke }) => (
    <Paper
        sx={{
            p: 3,
            bgcolor: 'rgba(255, 64, 129, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 64, 129, 0.2)'
        }}
    >
        <Typography variant="h6" sx={{ color: '#ff4081', mb: 2 }}>
            Active Campaign Support
        </Typography>
        <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
            You are currently supporting this campaign with{' '}
            <strong>{formatTokenAmount(currentGrant.authorization.max_tokens)}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
            Expires: {dayjs(currentGrant.expiration).format('MMMM D, YYYY')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                variant="outlined"
                onClick={onEdit}
                startIcon={<EditIcon />}
                sx={{
                    borderColor: 'rgba(255,64,129,0.5)',
                    color: '#ff4081',
                    '&:hover': {
                        borderColor: '#ff4081',
                        bgcolor: 'rgba(255,64,129,0.1)'
                    }
                }}
            >
                Update Amount
            </Button>
            <Button
                variant="outlined"
                color="error"
                onClick={onRevoke}
                startIcon={<DeleteIcon />}
                sx={{
                    borderColor: 'rgba(255,64,129,0.5)',
                    color: '#ff4081',
                    '&:hover': {
                        borderColor: '#ff4081',
                        bgcolor: 'rgba(255,64,129,0.1)'
                    }
                }}
            >
                Revoke Support
            </Button>
        </Box>
    </Paper>
);

export default GrantDetails;
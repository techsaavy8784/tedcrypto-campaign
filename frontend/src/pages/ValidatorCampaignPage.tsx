import React, { useCallback, useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { Campaign } from "../types/Campaign";
import { useApi } from "../context/ApiProvider";
import { CircularProgress, Box, Typography, Fade } from "@mui/material";
import { styled } from '@mui/system';
import CampaignProgress from "../components/Campaign/CampaignProgress";
import CommitForm from "../components/Campaign/CommitForm";
import StepsComponent from "../components/StepsComponent";
import CampaignSupporters from "../components/Campaign/CampaignSupporters";

const LoadingWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '2rem',
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '1rem',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
});

const ContentWrapper = styled(Box)({
    animation: 'fadeIn 0.5s ease-in-out',
    '@keyframes fadeIn': {
        from: {
            opacity: 0,
            transform: 'translateY(20px)'
        },
        to: {
            opacity: 1,
            transform: 'translateY(0)'
        }
    }
});

const ValidatorCampaignPage = () => {
    const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);
    const api = useApi();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api?.get("/campaign/last");
            if (response?.ok && response?.body) {
                setCampaign(response.body);
                return;
            }
            throw new Error("Failed to fetch data!");
        } catch (error) {
            console.error("Error:", error);
            enqueueSnackbar("Failed to fetch campaign data. Please try again later.", {
                variant: "error",
                anchorOrigin: { vertical: 'top', horizontal: 'center' }
            });
            setCampaign(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading && !campaign) {
        return (
            <Fade in={true} timeout={1000}>
                <LoadingWrapper>
                    <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{
                            color: "#ff4081",
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            }
                        }}
                    />
                    <Typography
                        variant="h5"
                        sx={{
                            color: "#fff",
                            textAlign: 'center',
                            fontWeight: 500,
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        Loading Campaign Data...
                    </Typography>
                </LoadingWrapper>
            </Fade>
        );
    }

    if (!campaign) {
        return (
            <Box sx={{
                textAlign: 'center',
                padding: '2rem',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)'
            }}>
                <Typography variant="h5" color="error">
                    No active campaign found
                </Typography>
            </Box>
        );
    }

    return (
        <Fade in={true} timeout={800}>
            <ContentWrapper>
                <CampaignProgress campaign={campaign} />
                <StepsComponent />
                <CommitForm campaign={campaign} />
                <CampaignSupporters campaign={campaign} />
            </ContentWrapper>
        </Fade>
    );
};

export default ValidatorCampaignPage;
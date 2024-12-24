import React from "react";
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, Avatar, Grid, Paper } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TokenIcon from '@mui/icons-material/Token';
import TimelineIcon from '@mui/icons-material/Timeline';
import RewardIcon from '@mui/icons-material/EmojiEvents';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PaymentsIcon from '@mui/icons-material/Payments';
import SyncIcon from '@mui/icons-material/Sync';
import WarningIcon from '@mui/icons-material/Warning';
import { motion } from "framer-motion";

const FAQ: React.FC = () => {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqs = [
        {
            question: "Is my investment safe during this campaign?",
            answer: "Absolutely! Your tokens remain completely safe as they're only moving between active validators in the network. You'll never lose money in this process - in fact, if you join early, you'll earn extra through our commission refunds. The redelegation happens automatically between validators in the active set, ensuring your tokens are always earning rewards.",
            icon: <SecurityIcon sx={{ color: '#ff4081' }} />
        },
        {
            question: "How do commission refunds work?",
            answer: "Commission refunds are processed automatically every week. When you receive a refund, it will include a memo indicating it's from our validator commission. The refund amount is calculated based on your delegation size and the campaign tier you qualified for. Early supporters (0-20%) receive 100% commission refunds, while the next tier (20-50%) receives 50% refunds.",
            icon: <PaymentsIcon sx={{ color: '#ff4081' }} />
        },
        {
            question: "How is the automated process managed?",
            answer: "Our system performs hourly and daily checks to ensure grants can be executed at the optimal time. If a grant becomes invalid (due to technical reasons), it's automatically removed from our system. To ensure smooth operation, we recommend avoiding unstaking or redelegating during your support period, as these actions could interfere with the grant execution.",
            icon: <SyncIcon sx={{ color: '#ff4081' }} />
        },
        {
            question: "What happens to my delegation during the campaign?",
            answer: "Your tokens will be automatically redelegated from your current validator to ours when the campaign reaches its goal. This process is completely safe as it only occurs between active validators, ensuring continuous rewards. Plus, early supporters receive additional benefits through our commission refund program.",
            icon: <TimelineIcon sx={{ color: '#ff4081' }} />
        },
        {
            question: "How do I manage or revoke my support?",
            answer: "You can revoke your support at any time through our interface. Since the grant is a permission you've given to our wallet, only you can revoke it - we cannot and will not revoke it from our side. This ensures you maintain full control over your delegation. If you decide to revoke, simply use the 'Revoke Support' button in the campaign interface.",
            icon: <AutorenewIcon sx={{ color: '#ff4081' }} />
        },
        {
            question: "Are there any risks or things to avoid?",
            answer: "While the campaign is completely safe, there are a few things to keep in mind: 1) Avoid unstaking or redelegating during your support period as it may interfere with the grant execution. 2) If you need to make changes, it's best to revoke your current grant and create a new one. 3) Our system automatically handles invalid grants, but maintaining your delegation stable ensures you get the most benefits.",
            icon: <WarningIcon sx={{ color: '#ff4081' }} />
        },
        {
            question: "What makes this campaign special?",
            answer: "Our campaign combines security with exceptional rewards. You're not just supporting a validator - you're earning extra benefits like commission refunds and bonus TedLotto tickets. Since we only operate between active validators, your tokens are always earning, and with our automated systems, everything happens seamlessly without requiring your intervention.",
            icon: <RewardIcon sx={{ color: '#ff4081' }} />
        },
        {
            question: "How do TedLotto ticket bonuses work?",
            answer: "TedLotto ticket bonuses are calculated based on your delegated amount and when you joined the campaign. The bonus (2x or 1.5x) applies only to tickets earned from your campaign delegation amount. These bonuses continue as long as you maintain your delegation, making early support even more rewarding.",
            icon: <TokenIcon sx={{ color: '#ff4081' }} />
        }
    ];

    return (
        <Box mt={6} sx={{ color: "#f0f0f0" }}>
            <Grid container alignItems="center" sx={{ backgroundColor: "#1e0034", p: 2, borderRadius: "8px 8px 0 0" }}>
                <Grid item>
                    <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', width: 40, height: 40 }}>
                        <QuestionAnswerIcon sx={{ fontSize: 24, color: '#ff4081' }} />
                    </Avatar>
                </Grid>
                <Grid item sx={{ ml: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: '#fff' }}>Frequently Asked Questions</Typography>
                </Grid>
            </Grid>
            <Paper sx={{
                backgroundColor: "#2a0e4d",
                borderRadius: "0 0 8px 8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                overflow: 'hidden'
            }}>
                <Box sx={{ p: 3 }}>
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Accordion
                                expanded={expanded === `panel${index}`}
                                onChange={handleChange(`panel${index}`)}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                    color: "#f0f0f0",
                                    mb: 2,
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "8px !important",
                                    '&:before': {
                                        display: 'none',
                                    },
                                    '&.Mui-expanded': {
                                        margin: '0 0 16px 0',
                                    },
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: "#ff4081" }} />}
                                    sx={{
                                        '& .MuiAccordionSummary-content': {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }
                                    }}
                                >
                                    {faq.icon}
                                    <Typography variant="h6" sx={{
                                        fontWeight: "600",
                                        color: expanded === `panel${index}` ? '#ff4081' : '#fff'
                                    }}>
                                        {faq.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'rgba(255,255,255,0.9)',
                                            lineHeight: 1.6,
                                            pl: 5
                                        }}
                                    >
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </motion.div>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default FAQ;
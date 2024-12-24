import React from "react";
import { Box, Typography, Avatar, Grid } from "@mui/material";

const TitledContainer: React.FC<{ title: string, icon?: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => {
    return (
        <Box mt={6} sx={{ color: "#f0f0f0" }}>
            <Grid container alignItems="center" sx={{ backgroundColor: "#1e0034", p: 2, borderRadius: "8px 8px 0 0" }}>
                {icon && (
                    <Grid item>
                        <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', width: 40, height: 40 }}>
                            {icon}
                        </Avatar>
                    </Grid>
                )}
                <Grid item sx={{ ml: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: '#fff' }}>{title}</Typography>
                </Grid>
            </Grid>
            <Box sx={{ backgroundColor: "#2a0e4d", p: 3, borderRadius: "0 0 8px 8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" }}>
                {children}
            </Box>
        </Box>
    );
};

export default TitledContainer;
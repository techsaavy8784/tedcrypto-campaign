import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loading: React.FC = () => (
    <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress sx={{ color: '#ff4081' }} />
    </Box>
);

export default Loading;
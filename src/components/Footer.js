import React from 'react';
import {Box, Typography} from "@material-ui/core";

const Footer = () => {
    return (
        <div style={{border:"5%", color:"black", marginTop:"15%" }}>
            <hr style={{color:"black"}}/>
        <Box mt={2} bottom={0} height={150} style={{backgroundColor:"#EDFBF7"}}>

            <Typography variant="body2" color="textSecondary" align="right">
                {"CopyRight © "}
                sjsage522, seungyeon Seo {new Date().getFullYear()}
                {"."}
            </Typography>
        </Box>
        </div>

    );
};

export default Footer;
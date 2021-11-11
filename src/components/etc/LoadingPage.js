import {Grid, Paper} from "@material-ui/core";
import React from "react";

export default function LoadingPage() {
    return (
        <Paper style={{margin: '3% 20% 0 20%', padding: 10}}>
            <Grid item xs={12} sm={12} md={12} container justifyContent="center">
                <h1> 로딩중... </h1>
            </Grid>
        </Paper>
    );
}
import React from 'react';
import {Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import {request} from "../../util/APIUtils";

class UpdateInfo extends React.Component {

    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const nickname = data.get("nickname");
        request("/user", "PATCH", {
            nickname
        }).then(() => {
            window.location.href = "/";
        })
            .catch((response) => response.json()
                .then((json) => alert(json.error.message))
            );
    }

    render() {
        return (
            <Container component="main" maxWidth="xs" style={{marginTop: "8%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5">
                            별명을 설정해 주세요
                        </Typography>
                    </Grid>
                </Grid>
                <form noValidate onSubmit={this.handleSubmit}>
                    {/* submit 버튼을 클릭하면 handleSubmit 이 실행됨 */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="nickname"
                                label="닉네임"
                                name="nickname"
                                autoComplete="nickname"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                설정하기
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        );
    }
}

export default UpdateInfo;
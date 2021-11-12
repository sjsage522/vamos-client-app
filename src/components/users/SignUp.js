import React from "react";
import {Button, Container, Grid, TextField, Typography, Link} from "@material-ui/core";
import {signup} from "../../util/APIUtils";
import icon from "../../img/icon.png";
import Footer from "../Footer";

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        const data = new FormData(event.target);
        const nickname = data.get("nickname");
        const email = data.get("email");
        const password = data.get("password");
        signup({email, nickname, password})
            .then((response) => {
                    window.location.href = "/login";
                }
            )
            .catch((response) => response.json().then((json) => {
                alert(json.error.message);
            }))
        ;
    }

    render() {
        return (
            <div style={{padding:"87px", background:"#EDFBF7"}}>
            <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
                <form noValidate onSubmit={this.handleSubmit} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>

                            <Typography component="h1" variant="h5" align="left">
                                <img width="35%" src={icon} align="right" />    회원 가입
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="fname"
                                name="nickname"
                                variant="outlined"
                                required
                                fullWidth
                                id="nickname"
                                label="사용자 별명"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="email"
                                name="email"
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="이메일 주소"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="current-password"
                                name="password"
                                variant="outlined"
                                required
                                fullWidth
                                id="password"
                                label="패스워드"
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                style={{backgroundColor : "#479F8A", color: "white"}}
                            >
                                계정 생성
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-end" >
                        <Grid item style={{marginTop:"2%"}}>
                            <Link href="/login" variant="body2" style={{marginTop:"2%", color:"#DC2222"}} >
                                이미 계정이 있습니까? 로그인 하세요.
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Container>
                <Footer/>
            </div>
        );
    }
}

export default SignUp;
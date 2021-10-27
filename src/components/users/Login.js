import React from "react";
import {login} from "../../util/APIUtils";
import {Button, Container, Grid, TextField, Typography, Link, Paper} from "@material-ui/core";
import {GOOGLE_AUTH_URL, NAVER_AUTH_URL, KAKAO_AUTH_URL} from "../../config/AppConfig";
import googleLogo from '../../img/google-logo.png'
import naverLogo from '../../img/naver-logo.png'
import kakaoLogo from '../../img/kakao-logo.png'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const email = data.get("email");
        const password = data.get("password");
        login({email, password})
            .then(() => {
                window.location.href = "/";
            })
            .catch((response) => response.json()
                .then((json) => alert(json.error.message))
            );
    }

    render() {
        return (
            <>
                <Container component="main" maxWidth="xs" style={{marginTop: "8%"}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5">
                                로그인
                            </Typography>
                        </Grid>
                    </Grid>
                    <form noValidate onSubmit={this.handleSubmit}>
                        {" "}
                        {/* submit 버튼을 클릭하면 handleSubmit 이 실행됨 */}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="이메일 주소"
                                    name="email"
                                    autoComplete="email"
                                    type="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="password"
                                    label="패스워드"
                                    name="password"
                                    autoComplete="current-password"
                                    type="password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    로그인
                                </Button>
                            </Grid>
                            <Link href="/signup" variant="body2">
                                <Grid item>계정이 없습니까? 여기서 가입하세요.</Grid>
                            </Link>
                        </Grid>
                    </form>
                    <p/>
                    <div style={{color: "dark", marginTop: "10%"}}>소셜 로그인</div>
                    <Paper style={{margin: 0, padding: 10}}>
                        <Grid item xs={12}>
                            <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}
                               style={{textDecorationLine: "none", color: "navy"}}
                            >
                                <img width="4%" height="5%" src={googleLogo} alt="Google"/> Log in with Google</a>
                        </Grid>
                    </Paper>
                    <p/>
                    <Paper style={{margin: 0, padding: 10}}>
                        <Grid item xs={12}>
                            <a className="btn btn-block social-btn naver" href={NAVER_AUTH_URL}
                               style={{textDecorationLine: "none", color: "navy"}}
                            >
                                <img width="4%" height="5%" src={naverLogo} alt="Naver"/> Log in with Naver</a>
                        </Grid>
                    </Paper>
                    <p/>
                    <Paper style={{margin: 0, padding: 10}}>
                        <Grid item xs={12}>
                            <a className="btn btn-block social-btn kakao" href={KAKAO_AUTH_URL}
                               style={{textDecorationLine: "none", color: "navy"}}
                            >
                                <img width="4%" height="5%" src={kakaoLogo} alt="Kakao"/> Log in with Kakao</a>
                        </Grid>
                    </Paper>
                </Container>
            </>
        );
    }
}

export default Login;
import React from 'react';
import {Button, Container, Grid, TextField, Typography} from "@material-ui/core";
import {request} from "../../util/APIUtils";
import Footer from "../Footer";
import {BiCheck, BiPencil} from "react-icons/bi";

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
            <div style={{padding:"150px", backgroundColor:"#EDFBF7"}}>
            <Container component="main" maxWidth="xs" style={{marginTop: "8%", marginBottom: "8%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5">
                            <BiPencil/>별명을 설정해 주세요.
                        </Typography>
                        <p/>
                        <Typography variant="body2" style={{color:"darkgrey"}}>
                            <BiCheck size={15} style={{marginLeft:5}}/> 닉네임을 설정해야 중고물품을 볼 수 있습니다.
                        </Typography>
                        <p/>
                        <Typography variant="body2" style={{color:"darkgrey"}}>
                            <BiCheck size={15} style={{marginLeft:5}}/> 익명활동을 위해 닉네임을 설정해야 합니다.
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
                                style={{marginTop:'2%'}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                style={{backgroundColor:"#CD4841", color:"white"}}
                            >
                                설정하기
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
                <div style={{padding: "50px", backgroundColor: "#EDFBF7"}}/>
            <Footer/>
            </div>
        );
    }
}

export default UpdateInfo;
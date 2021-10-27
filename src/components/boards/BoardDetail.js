import React from "react";
import {Button, CardActions, CardContent, Grid, Paper, Typography} from "@material-ui/core";
import {ThemeProvider, unstable_createMuiStrictModeTheme} from "@material-ui/core/styles";
import Carousel from "react-material-ui-carousel";
import {Link} from "react-router-dom";
import {request} from "../../util/APIUtils";
import LoadingPage from "../LoadingPage";

const theme = unstable_createMuiStrictModeTheme();

class BoardDetail extends React.Component {
    constructor(props) {
        super(props);
        this.board = props.location.state;
        this.state = {
            email: "",
            loading: true,
        }
        this._isMounted = false;
    }


    componentDidMount() {
        this._isMounted = true;

        request("/user/me", "GET", null)
            .then((response) => response.json().then((json) => {
                if (this._isMounted)
                    this.setState({email: json.data.email, loading: false});
            }))
            .catch(response => {
                if (response.status === 401) {
                    window.location.href = "/login";
                }
            });
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    deleteBoardHandler = (id) => {
        request("/board/" + id, "DELETE", null);
        alert("삭제 되었습니다.");
        window.location.href = "/";
    }

    render() {
        const board = this.board;
        let detail = (
            <Paper style={{margin: '3% 20% 0 20%', padding: 10}}>
                <Grid item xs={12} sm={12} md={12} key={board.id} container justifyContent="center">
                    <ThemeProvider theme={theme}>
                        <Grid>
                            <Carousel
                                indicatorIconButtonProps={{
                                    style: {
                                        padding: '10px',
                                        color: 'pink',
                                        textAlign: "center",
                                    }
                                }}
                            >
                                {board.photos.length > 0 ?
                                    board.photos.map((image, idx) => {
                                        return (
                                            <img
                                                className="d-block w-100"
                                                key={idx}
                                                src={image.file_download_uri}
                                                alt="First slide"
                                                style={{
                                                    width: "200px",
                                                    height: "200px",
                                                    border: "3px solid pink",
                                                    borderRadius: "16px",
                                                }}
                                            />
                                        );
                                    }) : ""
                                }
                            </Carousel>
                        </Grid>
                        <Grid item xs={12}>
                            <CardContent>
                                <hr/>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    {board.category_info.category_name[0]}
                                </Typography>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {board.title}
                                </Typography>
                            </CardContent>
                            <CardContent>
                                <Grid justifyContent="flex-end" container>
                                    거래가격 : <span style={{color: 'navy'}}>&nbsp;{board.price}</span>
                                </Grid>
                                <Grid justifyContent="flex-end" container>
                                    작성자 : <span style={{color: 'hotpink'}}>&nbsp;{board.user_info.email}</span>
                                </Grid>
                                <hr/>
                                <Typography variant="body2" component="p">
                                    {board.content}
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid>
                            <CardActions>
                                <Link
                                    to={{
                                        pathname: "/",
                                    }}
                                    style={{
                                        textDecorationLine: 'none',
                                    }}
                                >
                                    <Button size="medium" color="secondary">
                                        돌아가기
                                    </Button>
                                </Link>
                                {
                                    board.user_info.email === this.state.email ?
                                        <Link
                                            to={{
                                                pathname: `/update/board/${board.id}`,
                                                state: board,
                                            }}
                                            style={{
                                                textDecorationLine: 'none',
                                            }}
                                        >
                                            <Button size="medium" color="secondary">
                                                수정하기
                                            </Button>
                                        </Link>
                                        : null
                                }
                                {
                                    board.user_info.email === this.state.email ?
                                        <Button size="medium"
                                                color="secondary"
                                                onClick={() => this.deleteBoardHandler(board.id)}
                                        >
                                            삭제하기
                                        </Button>
                                        : null
                                }
                                {/*<Button size="medium" color="secondary">*/}
                                {/*    답글*/}
                                {/*</Button>*/}
                            </CardActions>
                        </Grid>
                    </ThemeProvider>
                </Grid>
            </Paper>
        );

        let content = LoadingPage();
        if (!this.state.loading) content = detail;

        return content;
    }
}

export default BoardDetail;
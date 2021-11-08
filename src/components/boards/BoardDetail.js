import React from "react";
import {Button, CardActions, CardContent, Grid, Paper, TextField, Typography} from "@material-ui/core";
import {ThemeProvider, unstable_createMuiStrictModeTheme} from "@material-ui/core/styles";
import Carousel from "react-material-ui-carousel";
import {Link, NavLink} from "react-router-dom";
import {request} from "../../util/APIUtils";
import Comment from "../comments/Comment";
import {BiTrash,BiArrowFromRight} from "react-icons/bi";
import FooterMain from "../FooterMain";

const theme = unstable_createMuiStrictModeTheme();

class BoardDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: props.location.state,
            currentUser: {},
            comments: {},
            commentText: "",
        }
    }

    componentDidMount() {
        request("/user/me", "GET", null)
            .then((response) => response.json().then((json) => {
                const currentUser = json.data
                this.updateState(currentUser);
            }))
            .catch(response => {
                if (response.status === 401) {
                    window.location.href = "/login";
                }
            });
    }

    updateState(user) {
        request("/comments/board/" + this.state.board.id, "GET", null)
            .then((response) => (response.json()).then((json) => {
                this.setState({comments: json, commentText: "", currentUser: user});
            }))
    }

    historyHandler = () => {
        if (typeof this.props.history == 'undefined') window.location.href = "/";
        else this.props.history.goBack();
    }

    deleteBoardHandler = (id) => {
        request("/board/" + id, "DELETE", null);
        alert("삭제 되었습니다.");
        window.location.href = "/";
    }

    commentTextHandler = (event) => {
        this.setState({commentText: event.target.value})
    }

    handleSubmitComment = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const content = data.get("comment");

        if (content.length <= 0) {
            alert("내용을 입력해 주세요!");
            return;
        }

        request("/comment/board/" + this.state.board.id, "POST", {
            parentId: null,
            content
        })
            .then((response) => (response.json().then((json) => {
                this.updateState(json.data.user_info);
            })))
            .catch((response) => response.json().then((json) => {
                alert(json.error.message);
            }));
    }

    getCurrentUserEmail() {
        return this.state.currentUser.email;
    }

    render() {
        const board = this.state.board;
        const currentUser = this.state.currentUser;
        const comments = this.state.comments.data;

        return (
            <>
            <div style={{padding :'110px',background:'#F6F6F6'}}>
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
                                                        width: "300px",
                                                        height: "350px",
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
                                        작성자 : <span style={{color: 'hotpink'}}>&nbsp;{board.user_info.nickname}</span>
                                    </Grid>
                                    <hr/>
                                    <Typography variant="body2" component="p">
                                        {board.content}
                                    </Typography>
                                </CardContent>
                            </Grid>
                            <Grid>
                                <CardActions>
                                    <Button size="medium" color="secondary" onClick={this.historyHandler}>
                                        <BiArrowFromRight size={20} /> 돌아가기
                                    </Button>
                                    {
                                        board.user_info.email !== this.getCurrentUserEmail() ?
                                            <NavLink
                                                to={{
                                                    pathname: `/chat/${board.id}`,
                                                    state: {
                                                        board,
                                                        currentUser,
                                                        buyerId: currentUser.id,
                                                    }
                                                }}
                                                style={{
                                                    textDecorationLine: 'none',
                                                }}
                                            >
                                                <Button size="medium" color="secondary">
                                                    거래하기
                                                </Button>
                                            </NavLink>
                                            : null
                                    }
                                    {
                                        board.user_info.email === this.getCurrentUserEmail() ?
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
                                        board.user_info.email === this.getCurrentUserEmail() ?
                                            <Button size="medium"
                                                    color="secondary"
                                                    onClick={() => this.deleteBoardHandler(board.id)}
                                            >
                                                삭제하기<BiTrash/>
                                            </Button>
                                            : null
                                    }

                                </CardActions>
                            </Grid>
                        </ThemeProvider>
                    </Grid>
                </Paper>
                <Paper style={{margin: '3% 20% 0 20%', padding: 10, background:"#EDFBF7"}}>
                    <CardActions style={{justifyContent: 'center'}}>
                        <form noValidate onSubmit={this.handleSubmitComment}>
                            <Grid container>
                                <TextField
                                    name="comment"
                                    size="small"
                                    variant="outlined"
                                    id="comment"
                                    label="댓글을 입력해 주세요."
                                    color="primary"
                                    multiline
                                    value={this.state.commentText}
                                    onChange={this.commentTextHandler}
                                    style={{background:"white"}}
                                />
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    size="small"
                                    style={{
                                        marginLeft: "10px",
                                        color:"#DC2222"
                                    }}
                                >
                                    등록
                                </Button>
                            </Grid>
                        </form>
                    </CardActions>
                </Paper>
                <Comment comments={comments}
                         board={board}
                         currentUser={this.state.currentUser}
                         update={this.updateState.bind(this)}
                />
            </div>
                <FooterMain/>
            </>
        );
    }
}

export default BoardDetail;
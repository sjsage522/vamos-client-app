import React from "react";
import {Button, CardActions, CardContent, Grid, Paper, TextField, Typography} from "@material-ui/core";
import {ThemeProvider, unstable_createMuiStrictModeTheme} from "@material-ui/core/styles";
import Carousel from "react-material-ui-carousel";
import {Link} from "react-router-dom";
import {request} from "../../util/APIUtils";
import {getLastTime} from "../../util/TimeUtils";
import noImage from "../../img/no-image.png";

const theme = unstable_createMuiStrictModeTheme();

class BoardDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: props.location.state,
            email: "",
            comments: {},
            commentText: "",
        }
    }

    componentDidMount() {
        request("/user/me", "GET", null)
            .then((response) => response.json().then((json) => {
                this.setState({email: json.data.email});
                this.setComments();
            }))
            .catch(response => {
                if (response.status === 401) {
                    window.location.href = "/login";
                }
            });
    }

    setComments() {
        request("/comments/board/" + this.state.board.id, "GET", null)
            .then((response) => (response.json()).then((json) => {
                this.setState({comments: json, commentText: ""});
            }))
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
                this.setComments();
            })))
            .catch((response) => response.json().then((json) => {
                alert(json.error.message);
            }));
    }

    getCommentLastTime = (comment) => {
        const compare = new Date(comment.created_at);
        const now = new Date() //현재시간
        return getLastTime(compare, now);
    }

    render() {
        let board = this.state.board;
        let comments = this.state.comments.data;

        return (
            <>
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

                                </CardActions>
                            </Grid>
                        </ThemeProvider>
                    </Grid>
                </Paper>
                <Paper style={{margin: '3% 20% 0 20%', padding: 10}}>
                    <CardActions style={{justifyContent: 'center'}}>
                        <form noValidate onSubmit={this.handleSubmitComment}>
                            <Grid container>
                                <TextField
                                    name="comment"
                                    size="small"
                                    variant="outlined"
                                    id="comment"
                                    label="댓글을 입력해 주세요."
                                    color="secondary"
                                    multiline
                                    autoFocus
                                    value={this.state.commentText}
                                    onChange={this.commentTextHandler}
                                />
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                    style={{
                                        marginLeft: "10px"
                                    }}
                                >
                                    등록
                                </Button>
                            </Grid>
                        </form>
                    </CardActions>
                    <hr/>
                </Paper>
                <Paper style={{margin: '3% 20% 0 20%', padding: 10}}>
                    {
                        typeof comments !== 'undefined' && comments.length > 0 ?
                            this.state.comments.data.map((comment) => (
                                <div key={comment.comment_id} style={{
                                    marginBottom: "20px"
                                }}>
                                    <Grid container>
                                        <img src={comment.user_info.profile === null ?
                                            noImage : comment.user_info.profile
                                        }
                                             alt="profile"
                                             style={{
                                                 width: '25px',
                                                 height: '25px',
                                                 objectFit: 'cover',
                                                 marginRight: '10px',
                                                 borderRadius: '70%'
                                             }}
                                        />
                                        <Typography variant="h5" component="h2" gutterBottom>
                                            {comment.user_info.email}
                                        </Typography>
                                    </Grid>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        {comment.user_info.location.addressName}
                                        <span>&#183;</span> {this.getCommentLastTime(comment)}
                                    </Typography>
                                    <Grid container spacing={10}
                                          justifyContent="center"
                                    >
                                        <Grid item xs={12} sm={12} md={12}>
                                            {comment.content}
                                        </Grid>
                                    </Grid>
                                </div>
                            )) :
                            <Typography variant="subtitle2" color="textSecondary" align="center">
                                댓글이 존재하지 않습니다.
                            </Typography>
                    }
                </Paper>
            </>
        );
    }
}

export default BoardDetail;
import React from "react";
import {Button, Grid, Paper, Typography} from "@material-ui/core";
import noImage from "../../img/no-image.png";
import {Link} from "react-router-dom";
import {getLastTime} from "../../util/TimeUtils";
import {request} from "../../util/APIUtils";

class Comment extends React.Component {
    getCommentLastTime = (comment) => {
        const compare = new Date(comment.created_at);
        const now = new Date() //현재시간
        return getLastTime(compare, now);
    }

    deleteCommentHandler = (id) => {
        request("/comment/" + id, "DELETE", null)
            .then(() => {
                alert("삭제 되었습니다.");
                this.props.update();
            })
            .catch((response) => response.json().then((json) => {
                alert(json.error.message);
            }));
    }

    render() {
        const comments = this.props.comments;
        const board = this.props.board;
        const email = this.props.currentUser.email;

        return (
            <Paper style={{margin: '3% 20% 0 20%', padding: 10, background:"#EDFBF7"}}>
                {
                    typeof comments !== 'undefined' && comments.length > 0 ?
                        comments.map((comment) => (
                            <div key={comment.comment_id}>
                                <Grid container>
                                    <Grid style={{
                                        marginLeft: "10px"
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
                                                     marginRight: '5px',
                                                     borderRadius: '70%'
                                                 }}
                                            />
                                            <Typography variant="h6" component="h2" gutterBottom>
                                                {comment.user_info.email}
                                                <Grid container>
                                                    <Typography variant="subtitle2" color="textSecondary"
                                                                gutterBottom>
                                                        {comment.user_info.location.addressName}
                                                        <span> &#183;</span> {this.getCommentLastTime(comment)}
                                                    </Typography>
                                                </Grid>
                                                <Grid container>
                                                    <Typography variant="subtitle2">
                                                        {comment.content}
                                                    </Typography>
                                                </Grid>
                                            </Typography>
                                            <Grid container
                                                  style={{
                                                      marginLeft: "21px",
                                                  }}
                                            >
                                                <Link
                                                    to={{
                                                        pathname: `/apply/comment`,
                                                        state: {
                                                            comment,
                                                            board
                                                        },
                                                    }}
                                                    style={{
                                                        textDecorationLine: 'none',
                                                    }}
                                                >
                                                    <Button size="small" color="secondary">
                                                        답글쓰기
                                                    </Button>
                                                </Link>
                                                {comment.user_info.email === email ?
                                                    <Button size="small" color="secondary"
                                                            onClick={() => this.deleteCommentHandler(comment.comment_id)}
                                                    >
                                                        삭제하기
                                                    </Button> : null
                                                }
                                            </Grid>
                                            {
                                                comment.children.length > 0 ?
                                                    comment.children.map((comment) => (
                                                        <Grid container
                                                              key={comment.comment_id}
                                                              style={{
                                                                  marginLeft: "29px",
                                                                  marginBottom: "7px",
                                                                  marginTop: "10px",
                                                              }}
                                                        >
                                                            <img src={comment.user_info.profile === null ?
                                                                noImage : comment.user_info.profile
                                                            }
                                                                 alt="profile"
                                                                 style={{
                                                                     width: '25px',
                                                                     height: '25px',
                                                                     objectFit: 'cover',
                                                                     marginRight: '5px',
                                                                     borderRadius: '70%'
                                                                 }}
                                                            />
                                                            <Typography variant="caption" component="h2"
                                                                        gutterBottom>
                                                                {comment.user_info.email}
                                                                <Grid container>
                                                                    <Typography variant="subtitle2"
                                                                                color="textSecondary" gutterBottom>
                                                                        {comment.user_info.location.addressName}
                                                                        <span> &#183;</span> {this.getCommentLastTime(comment)}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid container>
                                                                    <Typography variant="subtitle2">
                                                                        {comment.content}
                                                                        {comment.user_info.email === email ?
                                                                            <Button size="small" color="secondary"
                                                                                    onClick={() => this.deleteCommentHandler(comment.comment_id)}
                                                                            >
                                                                                삭제하기
                                                                            </Button> : null
                                                                        }
                                                                    </Typography>
                                                                </Grid>
                                                            </Typography>
                                                        </Grid>
                                                    ))
                                                    : null
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <hr style={{
                                    align: "center",
                                    borderColor: "whitesmoke",
                                    marginBottom: "25px",
                                }}/>
                            </div>
                        )) :
                        <Typography variant="subtitle2" color="textSecondary" align="center">
                            댓글이 존재하지 않습니다.
                        </Typography>
                }
            </Paper>
        );
    }
}

export default Comment;
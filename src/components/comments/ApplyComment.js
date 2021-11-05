import React from "react";
import {Redirect} from "react-router-dom";
import {Button, Grid, Paper, Typography} from "@material-ui/core";
import noImage from "../../img/no-image.png";
import {getLastTime} from "../../util/TimeUtils";
import GoBackHistory from "../../util/GoBackHistory";
import {request} from "../../util/APIUtils";

class ApplyComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parentComment: props.location.state.comment,
            board: props.location.state.board,
            content: "",
            isSubmit: false,
        }
    }

    getCommentLastTime = (comment) => {
        const compare = new Date(comment.created_at);
        const now = new Date() //현재시간
        return getLastTime(compare, now);
    }

    onInputContentChange = (event) => {
        this.setState({content: event.target.value});
    }

    onButtonClick = () => {
        if (this.state.content.length <= 0) {
            alert("내용을 입력해 주세요!");
            return;
        }

        const parentComment = this.state.parentComment;
        request("/comment/board/" + parentComment.board_id, "POST", {
            parentId: parentComment.comment_id,
            content: this.state.content,
        })
            .then(() => {
                alert("답글이 등록 되었습니다.");
                this.setState({isSubmit: true});
            })
            .catch((response) => response.json().then((json) => {
                alert(json.error.message);
            }));
    }

    render() {
        const comment = this.state.parentComment;
        return (
            <>
                <GoBackHistory history={this.props.history}/>
                <Paper style={{margin: '3% 20% 0 20%', padding: 50}}>
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
                            {comment.user_info.nickname}
                        </Typography>
                    </Grid>
                    <Grid container>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            {comment.user_info.location.addressName}
                            <span>&#183;</span> {this.getCommentLastTime(comment)}
                        </Typography>
                    </Grid>
                    <Grid container spacing={10}
                          justifyContent="center"
                    >
                        <Grid item xs={12} sm={12} md={12}
                              style={{
                                  marginBottom: "15px"
                              }}
                        >
                            {comment.content}
                        </Grid>
                    </Grid>
                    <textarea placeholder="↳ 답글을 입력해 주세요."
                              onChange={this.onInputContentChange}
                              style={{
                                  width: '100%',
                                  height: '500px'
                              }}
                              id="textArea"/>
                    <Button className="submit-button"
                            fullWidth
                            onClick={this.onButtonClick}
                            variant="contained"
                            color="primary"
                            type="submit"
                            style={{
                                marginTop: "10px",
                            }}
                    >
                        등록
                    </Button>
                    {
                        this.state.isSubmit ?
                            <Redirect to={{
                                pathname: '/board/' + this.state.board.id,
                                state: this.state.board
                            }}
                            /> : null
                    }
                </Paper>
            </>
        );
    }
}

export default ApplyComment;
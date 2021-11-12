import React from "react";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@material-ui/core";
import {NavLink} from "react-router-dom";
import {TrendingFlat} from "@material-ui/icons";
import {getLastTime} from "../../util/TimeUtils";
import {request} from "../../util/APIUtils";
import {BiLike} from "react-icons/bi";

class ChatRoomInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            currentUser: props.currentUser,
            buyerNickname: "",
        }
    }

    componentDidMount() {
        const buyerId = this.state.item.buyer;

        const process = async () => {
            const userResponse = await request("/user/" + buyerId, "GET", null);
            const userJson = await userResponse.json();

            this.setState({
                buyerNickname: userJson.data.nickname,
            })
        }
        process().catch(console.log)
    }

    render() {
        const info = this.state.item;
        const compare = new Date(info.created_at);
        const now = new Date();
        const result = getLastTime(compare, now);
        const buyerNickname = this.state.buyerNickname;

        return (
            <div >
            <Grid container spacing={10} justifyContent="center">
                <Grid item xs={12} sm={12} md={12}>
                    <Card>
                        <Grid style={{
                            display: 'flex',
                            justifyContent: 'left',
                            margin: '10px',

                        }}>
                            {<span style={{color: 'grey', fontSize: '13px'}}>{result} 생성</span>}
                        </Grid>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                {info.board_info.category_info.category_name[0]}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                {info.board_info.location.address_name}
                            </Typography>
                            <Typography variant="h5" component="h2" gutterBottom>
                                {info.board_info.title}
                            </Typography>
                            <Typography variant="body1" component="p">
                                상태 : {info.board_info.status}
                            </Typography>
                            <Typography variant="body1" component="p">
                                구매자 : {buyerNickname}
                            </Typography>
                        </CardContent>
                        <CardActions style={{justifyContent: "center"}}>
                            <NavLink
                                to={{
                                    pathname: `/chat/${info.board_info.id}`,
                                    state: {
                                        board: info.board_info,
                                        currentUser: this.state.currentUser,
                                        buyerId: info.buyer
                                    },
                                }}
                                style={{
                                    textDecorationLine: 'none',
                                }}
                                target={"_blank"}
                                onClick={() => {
                                    const id = info.board_info.id;
                                    localStorage.setItem("id", id);
                                    localStorage.setItem("boardId" + id, info.board_info.id)
                                    localStorage.setItem("currentUser" + id, JSON.stringify(this.state.currentUser))
                                    localStorage.setItem("buyerId" + id, info.buyer)
                                }}
                            >
                                <Button size="small" color="secondary">
                                    참여하기<BiLike/>
                                </Button>
                            </NavLink>
                            <NavLink
                                to={{
                                    pathname: `/board/${info.board_info.id}`,
                                    state: info.board_info,
                                }}
                                style={{
                                    textDecorationLine: 'none',
                                }}
                            >
                                <Button variant="outlined" size="small" color="secondary">
                                    상세보기
                                </Button>
                            </NavLink>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            </div>
        );
    }
}

export default ChatRoomInfo;
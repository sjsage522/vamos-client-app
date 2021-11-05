import React from "react";
import {Button, Card, CardActions, CardContent, Grid, Typography} from "@material-ui/core";
import {NavLink} from "react-router-dom";
import {TrendingFlat} from "@material-ui/icons";
import {getLastTime} from "../../util/TimeUtils";

class ChatInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            currentUser: props.currentUser,
        }
        console.log("p", props)
    }

    render() {
        const info = this.state.item;
        const compare = new Date(info.created_at);
        const now = new Date();
        const result = getLastTime(compare, now);

        console.log("info", info)
        console.log("buyer", info.buyer)
        console.log("currentUser", this.state.currentUser)
        return (
            <Grid container spacing={10} justifyContent="center">
                <Grid item xs={12} sm={12} md={12}>
                    <Card>
                        <Grid style={{
                            display: 'flex',
                            justifyContent: 'left',
                            margin: '10px'
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
                            >
                                <Button size="small" color="secondary">
                                    참여하기<TrendingFlat/>
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
                                <Button size="small" color="secondary">
                                    더보기<TrendingFlat/>
                                </Button>
                            </NavLink>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

export default ChatInfo;
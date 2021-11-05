import React from 'react';
import {request} from "../../util/APIUtils";
import GoBackHistory from "../../util/GoBackHistory";
import ChatRoomInfo from "./ChatRoomInfo";
import {Grid, Paper, Typography} from "@material-ui/core";

class ChatRoomList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            sellerChatRoomInfos: [],
            buyerChatRoomInfos: [],
        }
    }

    componentDidMount() {
        const process = async () => {
            const userResponse = await request("/user/me", "GET", null);
            const userJson = await userResponse.json();

            const sellerChatRoomResponse = await request("/seller/chatRooms", "GET", null);
            const sellerChatRoomJson = await sellerChatRoomResponse.json();

            const buyerChatRoomResponse = await request("/buyer/chatRooms", "GET", null);
            const buyerChatRoomJson = await buyerChatRoomResponse.json();

            this.setState({
                currentUser: userJson.data,
                sellerChatRoomInfos: sellerChatRoomJson.data,
                buyerChatRoomInfos: buyerChatRoomJson.data,
            })
        }
        process().catch(console.log)
    }

    render() {
        const sellerChatRoomInfos = this.state.sellerChatRoomInfos;
        const buyerChatRoomInfos = this.state.buyerChatRoomInfos;
        const currentUser = this.state.currentUser;
        return (
            <>
                <GoBackHistory history={this.props.history}/>
                <Paper style={{margin: '3% 30% 0 30%', padding: 50}}>
                    {
                        sellerChatRoomInfos.length > 0 ?   <Grid container justifyContent="center">
                            <Typography variant="h5" component="h2" gutterBottom color="secondary">
                                거래 요청이 왔어요!
                            </Typography>
                        </Grid> : null
                    }
                    {
                        sellerChatRoomInfos.length > 0 ? sellerChatRoomInfos.map((chatInfo) => {
                            return (
                                <>
                                    <p/>
                                    <ChatRoomInfo item={chatInfo}
                                                  currentUser={currentUser}
                                                  key={chatInfo.id}/>
                                </>
                            );
                        }) : <Grid container
                                   justifyContent="center"
                                   style={{color: 'grey'}}
                        >
                            거래 요청이 없습니다 🥺
                        </Grid>
                    }
                </Paper>
                <Paper style={{margin: '3% 30% 0 30%', padding: 50}}>
                    {
                        buyerChatRoomInfos.length > 0 ? <Grid container justifyContent="center">
                            <Typography variant="h5" component="h2" gutterBottom color="secondary">
                                요청 목록 입니다!
                            </Typography>
                        </Grid> : null
                    }
                    {
                        buyerChatRoomInfos.length > 0 ? buyerChatRoomInfos.map((chatInfo) => {
                            return (
                                <>
                                    <p/>
                                    <ChatRoomInfo item={chatInfo}
                                                  currentUser={currentUser}
                                                  key={chatInfo.id}/>
                                </>
                            );
                        }) : <Grid container
                                   justifyContent="center"
                                   style={{color: 'grey'}}
                        >
                            거래를 요청해 보세요 🙌🏻
                        </Grid>
                    }
                </Paper>
            </>
        );
    }
}

export default ChatRoomList;
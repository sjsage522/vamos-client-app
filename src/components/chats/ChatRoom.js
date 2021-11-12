import React from 'react';
import {request} from "../../util/APIUtils";
import {Button, Grid, Paper} from "@material-ui/core";
import "./Chat.css";
import {API_BASE_URL} from "../../config/AppConfig";
import SockJsClient from "react-stomp";

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.identify = localStorage.getItem("id");
        this.boardId = localStorage.getItem("boardId" + this.identify)
        this.currentUser = JSON.parse(localStorage.getItem("currentUser" + this.identify))
        this.buyerId = localStorage.getItem("buyerId" + this.identify)
        this.state = {
            roomId: "",
            seller: {},
            buyer: {},
            contents: [],
            submitContent: "",
        }
    }

    componentDidMount() {
        const init = async () => {
            const chatRoomResponse = await request("/chat/" + this.boardId + "/" + this.buyerId, "GET", null);
            const chatInfoJson = await chatRoomResponse.json();
            if (chatInfoJson.data.chatting_info === null) alert("채팅방이 생성되었습니다!");

            const buyerResponse = await request("/user/" + chatInfoJson.data.buyer, "GET", null);
            const buyerJson = await buyerResponse.json();
            const sellerResponse = await request("/user/" + chatInfoJson.data.seller, "GET", null);
            const sellerJson = await sellerResponse.json();

            this.setState({
                roomId: chatInfoJson.data.id,
                seller: sellerJson.data,
                buyer: buyerJson.data,
                contents: chatInfoJson.data.chatting_info,
            })

            this.scrollToBottom();
            localStorage.clear();
        }
        init().catch(console.log);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.scrollToBottom();
    }

    onInputContentChange = (event) => {
        this.setState({submitContent: event.target.value});
    }

    sendMessage = () => {
        if (this.state.submitContent.length <= 0) {
            alert("내용을 입력해 주세요!");
            return;
        }

        const process = async () => {
            await this.clientRef.sendMessage('/send', JSON.stringify({
                writerEmail: this.currentUser.email,
                chatRoomId: this.state.roomId,
                content: this.state.submitContent,
            }));
        }
        process().catch(console.log);
    }

    onMessageHandler = (response) => {
        this.setState({
            contents: response.chatting_info,
            submitContent: "",
        })

        let element = document.getElementById("textArea");
        element.value = "";
    }

    scrollToBottom = () => {
        this.messageEnd.scrollIntoView({behavior: 'smooth'})
    }

    render() {
        const contents = (this.state.contents !== null ?
            this.state.contents.sort(function (c1, c2) {
            return c1.id - c2.id;
        }) : null);
        const topic = "/topic/" + this.state.roomId + "/queue/messages";

        return (
            <>
                <Paper style={{margin: '3% 20% 0 20%', backgroundColor: 'darkgrey'}}>
                    <Grid container justifyContent="flex-end" style={{fontSize: '23px', color: 'white'}}>
                        {this.state.seller.nickname + " 채팅방"}
                    </Grid>
                </Paper>
                <Paper style={{margin: '3px 20% 0 20%', padding: 10, backgroundColor: '#EDFBF7'}}>
                    {
                        (contents != null && contents.length > 0) ? contents.map((value) => {
                            const date = new Date(value.created_at);
                            const year = date.getFullYear();
                            const month = date.getMonth() + 1;
                            const day = date.getDate();
                            const hours = date.getHours();
                            const minutes = date.getMinutes();
                            return (
                                <div key={value.id}>
                                    {
                                        //채팅을 한사람 기준, 채팅내용이 왼쪽에 보임
                                        <div style={{
                                            display: 'flex'
                                        }}>
                                            {
                                                value.writer === this.currentUser.id ?
                                                    <>
                                                        <div className="box1 sb1">
                                                            <div style={{
                                                                fontSize: '12px',
                                                                marginBottom: '5px',
                                                                color: 'grey'
                                                            }}>
                                                                {year + "/" + month + "/" + day + ", " + hours + "시" + minutes + "분 [나]"}
                                                            </div>
                                                            <Grid container justifyContent="flex-end">
                                                                {value.content}
                                                            </Grid>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div className="box2 sb2">
                                                            <div style={{
                                                                fontSize: '12px',
                                                                marginBottom: '5px',
                                                                color: 'grey'
                                                            }}>
                                                                {year + "/" + month + "/" + day + ", " + hours + "시" + minutes + "분 [상대방]"}
                                                            </div>
                                                            <Grid container justifyContent="flex-start">
                                                                {value.content}
                                                            </Grid>
                                                        </div>
                                                    </>
                                            }
                                        </div>
                                    }
                                </div>
                            )
                        }) : <Grid container
                                   justifyContent="center"
                                   style={{color: 'black'}}
                        >
                            채팅을 시작해 주세요!
                        </Grid>
                    }
                    <textarea placeholder="메시지를 입력해주세요."
                              onChange={this.onInputContentChange}
                              style={{
                                  marginTop: '20%',
                                  width: '100%',
                                  height: '150px',
                                  borderRadius: '8px',
                              }}
                              id="textArea"/>
                    <Grid container justifyContent="flex-end">
                        <Button className="submit-button"
                                onClick={this.sendMessage}
                                variant="contained"
                                type="submit"
                                ref={el => {this.messageEnd = el;}}
                                style={{backgroundColor:"#DC2222", color:'white'}}
                        >
                            전송
                        </Button>
                    </Grid>
                </Paper>

                {/*WebSocket*/}
                <SockJsClient
                    url={API_BASE_URL + "/webSocket"}
                    topics={[topic]}
                    onMessage={this.onMessageHandler}
                    ref={(client) => {
                        this.clientRef = client
                    }}
                />
            </>
        );
    }
}

export default ChatRoom;
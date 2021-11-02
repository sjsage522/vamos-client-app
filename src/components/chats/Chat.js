import React from 'react';
import SockJsClient from 'react-stomp'
import {API_BASE_URL} from "../../config/AppConfig";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            submitContent: "",
        }
    }

    sendMessage = () => {
        this.clientRef.sendMessage('/send', JSON.stringify({
            writerEmail: 'son@test.com',
            chatRoomId: 203,
            content: this.state.submitContent,
        }));
    }

    onInputContentChange = (event) => {
        this.setState({submitContent: event.target.value});
    }

    onMessageHandler = (response) => {
        console.log("adssdadsasdasda")
        console.log(response);
    }

    render() {
        return (
            <div>
                <textarea placeholder="메시지를 입력해주세요."
                          onChange={this.onInputContentChange}
                          style={{
                              marginTop: '20%',
                              width: '100%',
                              height: '150px',
                              borderRadius: '8px',
                          }}
                          id="textArea"/>
                <SockJsClient
                    url={API_BASE_URL + "/webSocket"}
                    topics={['/topic/203/queue/messages']}
                    onMessage={this.onMessageHandler}
                    ref={(client) => {
                        this.clientRef = client
                    }}
                />
                <button onClick={this.sendMessage}>sendTo</button>
            </div>
        );
    }
}

export default Chat;
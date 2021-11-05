import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Box, Typography} from "@material-ui/core";
import App from "./App";
import Login from "./components/users/Login";
import SignUp from "./components/users/SignUp";
import Location from "./components/users/Location";
import UploadBoard from "./components/boards/UploadBoard";
import BoardDetail from "./components/boards/BoardDetail";
import NotFound from "./components/NotFound";
import ApplyComment from "./components/comments/ApplyComment";
import ChatRoom from "./components/chats/ChatRoom";
import ChatRoomList from "./components/chats/ChatRoomList";
import UpdateInfo from "./components/users/UpdateInfo";


function CopyRight() {
    return (
        <Box mt={2} bottom={0} height={150} style={{backgroundColor:"#EDFBF7"}}>
        <Typography variant="body2" color="textSecondary" align="center">
            {"CopyRight © "}
            sjsage522, {new Date().getFullYear()}
            {"."}
        </Typography>
        </Box>
    );
}

function CopyRight1() {
    return (
        <Box mt={2} bottom={0} height={150} style={{backgroundColor:"#EFEDE6"}}>
        <Typography variant="body2" color="textSecondary" align="center">
            {"CopyRight © "}
            sjsage522, {new Date().getFullYear()}
            {"."}
        </Typography>
        </Box>
    )
}

class AppRouter extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/">
                                <App/>
                            </Route>
                            <Route exact path="/board/:id"
                                   component={BoardDetail}
                            />
                            <Route exact path="/update/board/:id"
                                   component={UploadBoard}
                            />
                            <Route exact path="/upload">
                                <UploadBoard/>
                            </Route>
                            <Route exact path="/apply/comment"
                                   component={ApplyComment}
                            />
                            <Route exact path="/chat/:id"
                                   component={ChatRoom}
                            />
                            <Route exact path="/location">
                                <Location/>
                            </Route>
                            <Route exact path="/update/user/info">
                                <UpdateInfo/>
                            </Route>
                            <Route exact path="/chatList">
                                <ChatRoomList/>
                            </Route>
                            <Route exact path="/login">
                                <Login />
                            </Route>
                            <Route exact path="/signup">
                                <SignUp/>
                            </Route>
                            <Route component={NotFound}/>
                        </Switch>
                    </div>

                </Router>
            </div>
        );
    }
}

export default AppRouter;
import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Box, Typography} from "@material-ui/core";
import App from "./App";
import Login from "./components/users/Login";
import SignUp from "./components/users/SignUp";
import Location from "./components/users/Location";
import UploadBoard from "./components/boards/UploadBoard";

function CopyRight() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"CopyRight © "}
            sjsage522, {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

class AppRouter extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <div>
                        <Switch>
                            <Route path="/login">
                                <Login />
                            </Route>
                            <Route path="/signup">
                                <SignUp/>
                            </Route>
                            <Route path="/location">
                                <Location/>
                            </Route>
                            <Route path="/upload"
                                   render={(props) => (
                                       <UploadBoard {...props}/>
                                   )}
                            />
                            <Route path="/">
                                <App/>
                            </Route>
                        </Switch>
                    </div>
                    <Box mt={5}>
                        <CopyRight/>
                    </Box>
                </Router>
            </div>
        );
    }
}

export default AppRouter;
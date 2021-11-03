import React from "react";
import './App.css';
import {logout, request} from "./util/APIUtils";
import {AppBar, Button, Container, Grid, Toolbar, Typography} from "@material-ui/core";
import LoadingPage from "./components/LoadingPage";
import Board from "./components/boards/Board";
import {NavLink} from "react-router-dom";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: true,
            addressName: "",
            currentUser: {},
        }
    }

    // main page => 현재 위치 기준으로 모든 게시글 조회
    componentDidMount() {

        const process = async () => {
            const boardListResponse = await request("/boards", "GET", null);
            const boardListJson = await boardListResponse.json();

            const currentUserResponse = await request("/user/me", "GET", null);
            const currentUserJson = await currentUserResponse.json();

            this.setState({
                items: boardListJson.data.sort(function (item1, item2) {
                    return item2.id - item1.id;
                }),
                loading: false,
                currentUser: currentUserJson.data,
            })

            console.log(this.state.currentUser);
        }
        process()
            .catch((response) => {
            response.json().then((json) => {
                if (json.error.status === 400) window.location.href = "/Location"
                else if (json.error.status === 401) window.location.href = "/Login"
            })
        })
            .catch(console.log);
    }

    render() {
        let boards = this.state.items.length > 0 && (
                this.state.items.map((item, idx) => (
                    <Board
                        item={item}
                        key={item.id}
                    />
                ))
        );

        let navigationBar = (
            <AppBar position="static" style={{
                background: "#FF3366"
            }}>
                <Toolbar>
                    <Grid justifyContent="space-between" container>
                        <Grid item>
                            <Typography variant="h6" style={{
                                color: "white"
                            }}>
                                {this.state.items.length > 0 ?
                                    this.state.items[0].location.address_name : "VAMOS"}
                            </Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="overline" style={{
                                color: "white"
                            }}>
                                안녕하세요 {this.state.currentUser.email} 님!
                            </Typography>
                        </Grid>
                        <Grid>
                            <Button>
                                <NavLink to={{
                                    pathname: "/upload",
                                }}
                                         style={{
                                             textDecorationLine: 'none',
                                             color: 'white'
                                         }}
                                >
                                    게시글 작성하기
                                </NavLink>
                            </Button>
                            <Button>
                                <NavLink to="/location"
                                         style={{
                                             textDecorationLine: 'none',
                                             color: 'white'
                                         }}
                                >
                                    위치 설정하기
                                </NavLink>
                            </Button>
                            <Button>
                                <NavLink to="/chatList"
                                         style={{
                                             textDecorationLine: 'none',
                                             color: 'white'
                                         }}
                                >
                                    채팅
                                </NavLink>
                            </Button>
                        </Grid>
                        <Grid>
                            <Button color="inherit" onClick={logout} style={{
                                color: "white"
                            }}>
                                로그아웃
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );

        let boardListPage = (
            <div>
                {navigationBar}
                <p/>
                <Container maxWidth="md">
                    <div className="boardList">{boards}</div>
                </Container>
            </div>
        );

        let content = LoadingPage();
        if (!this.state.loading) content = boardListPage;

        return (
            <div className="App">
                {content}
            </div>
        );
    }
}

export default App;

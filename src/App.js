import React from "react";
import './App.css';
import {logout, request} from "./util/APIUtils";
import {AppBar, Button, Container, Grid, Toolbar, Typography} from "@material-ui/core";
import LoadingPage from "./components/LoadingPage";
import Board from "./components/boards/Board";
import {NavLink} from "react-router-dom";
import icon from "./img/icon.png";
import {BiCurrentLocation} from "react-icons/bi";
import FooterMain from "./components/FooterMain";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: true,
            addressName: "",
        }
    }

    // main page => 현재 위치 기준으로 모든 게시글 조회
    componentDidMount() {
        request("/boards", "GET", null)
            .then((response) => response.json().then((json) => {
                this.setState({items: json.data.sort(function (item1, item2) {
                        return item2.id - item1.id;
                    }), loading: false})
            }))
            .catch((response) => {
                response.json().then((json) => {
                    if (json.error.status === 400) window.location.href = "/Location"
                    else if (json.error.status === 401) window.location.href = "/Login"
                })
            });
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
                background: "#EDFBF7"
            }}>
                <Toolbar>
                    <Grid justifyContent="space-between" container>
                        <Grid item>
                            <img width="17%" src={icon} align='left'  />
                            <Typography variant="body1" style={{
                                color: "black",
                                marginTop:'1%'
                            }}> <BiCurrentLocation style={{marginRight:'1%'}}/>
                                {this.state.items.length > 0 ?
                                    this.state.items[0].location.address_name : "VAMOS"}
                            </Typography>
                        </Grid>
                        <Grid>
                            <Button>
                                <NavLink to={{
                                    pathname: "/upload",
                                }}
                                         style={{
                                             textDecorationLine: 'none',
                                             color: 'black'
                                         }}
                                >
                                    게시글 작성하기
                                </NavLink>
                            </Button>
                            <Button>
                                <NavLink to="/location"
                                         style={{
                                             textDecorationLine: 'none',
                                             color: 'black'
                                         }}
                                >
                                    위치 설정하기
                                </NavLink>
                            </Button>
                        </Grid>
                        <Grid>
                            <Button color="inherit" onClick={logout} style={{
                                color: "black"
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
            <FooterMain/>
            </div>
        );
    }
}

export default App;

import React from "react";
import {
    Button,
    Card, CardActionArea,
    CardActions,
    CardContent,
    Grid,
    Box,
    Typography
} from "@material-ui/core";
import {TrendingFlat, Chat} from "@material-ui/icons";
import Carousel from "react-material-ui-carousel";
import {ThemeProvider} from "@material-ui/core/styles";
import {unstable_createMuiStrictModeTheme} from '@material-ui/core/styles';
import {NavLink} from "react-router-dom";
import {getLastTime} from "../../util/TimeUtils";
import {request} from "../../util/APIUtils";
import {BiChat} from "react-icons/bi";
import empty from "../../img/empty.PNG";


const theme = unstable_createMuiStrictModeTheme();

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            chatRoomCount: 0,
        };
    }

    componentDidMount() {
        const process = async () => {
            const response = await request("/chatRooms/board/" + this.state.item.id, "GET", null);
            const json = await response.json();

            this.setState({
                chatRoomCount: json.data,
            })
        }
        process().catch(console.log)
    }

    render() {
        const board = this.state.item;
        const chatRoomCount = this.state.chatRoomCount;
        const compare = new Date(board.created_at);
        const now = new Date() //현재시간
        const result = getLastTime(compare, now);

        return (
            <Grid spacing={10}
                  justifyContent="center"
                  style={{marginRight:'3%', marginBottom:'3%'}}>
                <Grid item xs={12} sm={12} md={12} key={board.id}>
                    <Card>
                        <Grid style={{
                            display: 'flex',
                            justifyContent: 'left',
                            margin: '10px'
                        }}>
                            {<span style={{color: 'grey', fontSize: '13px'}}>{result}</span>}
                        </Grid>
                        <ThemeProvider theme={theme}>
                            <Carousel
                                indicatorIconButtonProps={{
                                    style: {
                                        padding: '10px',
                                        color: 'pink',
                                        textAlign: "center",
                                    }

                                }}
                            >
                                {board.photos.length > 0 ?
                                    board.photos.map((image, idx) => {
                                        return (
                                            <img
                                                className="d-block w-100"
                                                key={idx}
                                                src={image.file_download_uri}
                                                alt="First slide"
                                                style={{
                                                    width: "320px",
                                                    height: "270px",
                                                    border: "3px solid pink",
                                                    borderRadius: "16px"
                                                }}
                                            />
                                        );
                                    }) : <><img
                                        className="d-block w-100"
                                        src={empty}
                                        alt="First slide"
                                        style={{
                                                  width: "320px",
                                                  height: "270px",
                                                  border: "3px solid pink",
                                                  borderRadius: "16px"
                                        }}/><div style={{padding:'18px'}}/> </>
                                }
                            </Carousel>
                        </ThemeProvider>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                {board.category_info.category_name[0]}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                거래상태: {board.status} <a style={{marginLeft:'10px'}}></a>
                                채팅: {chatRoomCount} <BiChat/>
                            </Typography>
                            <Typography variant="h5" component="h2" gutterBottom>
                                {board.title.substring(0,8)}
                                {board.title.length > 8 ? <span>...</span> : ""}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {board.content.substring(0, 15)}
                                {board.content.length > 15 ? <span>...</span> : ""}
                            </Typography>
                        </CardContent>
                        <CardActions style={{justifyContent: "center"}}>
                            <NavLink
                                to={{
                                    pathname: `/board/${board.id}`,
                                    state: board,
                                }}
                                style={{
                                    textDecorationLine: 'none',
                                }}
                            >
                                <Button variant="contained" disableElevation size="small" color="secondary" >
                                    상세 보기
                                </Button>
                            </NavLink>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

        );
    }
}

export default Board;
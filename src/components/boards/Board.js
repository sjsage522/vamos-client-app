import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography
} from "@material-ui/core";
import {TrendingFlat} from "@material-ui/icons";
import Carousel from "react-material-ui-carousel";
import {ThemeProvider} from "@material-ui/core/styles";
import {unstable_createMuiStrictModeTheme} from '@material-ui/core/styles';
import {NavLink} from "react-router-dom";

const theme = unstable_createMuiStrictModeTheme();

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
        };
    }

    render() {
        const board = this.state.item;
        const compare = new Date(board.created_at);
        const now = new Date() //현재시간
        let result = Math.floor((now - compare) / 1000 / 60 / 60);
        if (result > 24) { //24시간 이상
            result = Math.floor(result / 24);
            if (result > 7) { //7일 이상
                result = `${compare.getFullYear()}. ${compare.getMonth() + 1} .${compare.getDay()}`
                // ex) 2021. 10. 27
            } else { //7일 이내
                result = result + '일전' // ex) 5일전
            }
        } else if (result === 0) { //1시간 미만
            result = Math.floor((now - compare) / 1000 / 60) + '분전';
        } else { //1시간 이상 24시간 미만
            result = result + '시간전';
        }

        return (
            <Grid container spacing={10} justifyContent="center">
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
                                                    width: "200px",
                                                    height: "200px",
                                                    border: "3px solid pink",
                                                    borderRadius: "16px"
                                                }}
                                            />
                                        );
                                    }) : ""
                                }
                            </Carousel>
                        </ThemeProvider>
                        <CardContent>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                {board.category_info.category_name[0]}
                            </Typography>
                            <Typography variant="h5" component="h2" gutterBottom>
                                {board.title}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {board.content.substring(0, 150)}
                                {board.content.length > 150 ? <span>...</span> : ""}
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

export default Board;
import React from "react";
import Carousel from 'react-material-ui-carousel';
import "./Board.css";
import {Button, FormControl, Grid, Link, NativeSelect, Paper, TextField, Typography,} from "@material-ui/core";
import {updateBoard, uploadBoard} from "../../util/APIUtils";
import {ThemeProvider, unstable_createMuiStrictModeTheme} from "@material-ui/core/styles";

const theme = unstable_createMuiStrictModeTheme();

const CATEGORIES = [
    '디지털기기', '생활가전', '가구/인테리어', '유아동', '유아도서',
    '생활/가공식품', '스포츠/레저', '여성패션/잡화', '남성패션/잡화', '게임/취미',
    '뷰티/미용', '반려동물용품', '도서/티켓/음반', '식물', '기타 중고물품',
    '삽니다'];

class UploadBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                id: "",
                title: "",
                content: "Content",
                price: 0,
                categoryNumber: 0,
                files: [],
                filesBase64: [],
            },
        };
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
    }

    componentDidMount() {
        if (typeof this.props.location != 'undefined') {
            const board = this.props.location.state;
            const thisItem = this.state.item;
            thisItem.id = board.id;
            thisItem.title = board.title;
            thisItem.content = board.content;
            thisItem.price = board.price;
            thisItem.categoryNumber = board.category_info.id;

            let fileArr = [];
            for (let i=0; i < board.photos.length; i++) {
                const photo = board.photos[i];
                this.dataURLtoFile(
                    photo.file_download_uri,
                    photo.original_file_name,
                    photo.extension
                ).then(file => fileArr[i] = file)
            }
            thisItem.files = fileArr;
            document.getElementById("textArea").value = thisItem.content;

            let base64Arr = [];
            for (let i = 0; i < board.photos.length; i++) {
                base64Arr[i] = board.photos[i].file_download_uri;
            }
            thisItem.filesBase64 = base64Arr;
            this.setState({item: thisItem})
        }
    }

    dataURLtoFile = async (dataURL, fileName, extension) => {
        const response = await fetch(dataURL);
        const data = await response.blob();
        return new File([data], fileName, {type:`image/${extension}`});
    }

    categoryChangeHandler(event) {
        const thisItem = this.state.item;
        thisItem.categoryNumber = parseInt(event.target.value);
        this.setState({
            item: thisItem
        });
    }

    onInputTitleChange = (e) => {
        const thisItem = this.state.item;
        thisItem.title = e.target.value;
        this.setState({item: thisItem});
    }

    onInputContentChange = (e) => {
        const thisItem = this.state.item;
        thisItem.content = e.target.value;
        this.setState({item: thisItem});
    }

    onInputPriceChange = (e) => {
        const thisItem = this.state.item;
        thisItem.price = e.target.value;
        this.setState({item: thisItem});
    }

    /**
     * 이미지 업로드, 업드드 후 썸네일 확인 가능 (카루셀 방식)
     */
    onInputFilesChange = (e) => {
        const thisItem = this.state.item;
        thisItem.files = e.target.files;
        thisItem.filesBase64 = [];
        this.setState({item: thisItem});

        for (let i = 0; i < e.target.files.length; i++) {
            if (e.target.files[i]) {
                let reader = new FileReader();
                reader.readAsDataURL(e.target.files[i]);
                reader.onloadend = () => {
                    const base64 = reader.result;
                    if (base64) {
                        let base64Sub = base64.toString();
                        thisItem.filesBase64 = [...thisItem.filesBase64, base64Sub];
                        this.setState({item: thisItem});
                    }
                }
            }
        }
    }


    onButtonClick = () => {
        if (typeof this.props.location == 'undefined') {
            uploadBoard(this.state.item);
            this.setState({
                item: {
                    title: "",
                    content: "",
                    price: "",
                    categoryNumber: 0,
                    files: "",
                },
            });

            window.location.href = "/";
        } else {
            const id = this.props.location.state.id;
            updateBoard(this.state.item, id);
            this.props.history.goBack();
        }
    }

    historyHandler = () => {
        if (typeof this.props.history == 'undefined') window.location.href = "/";
        else this.props.history.goBack();
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Paper style={{margin: '3% 30% 0 30%', padding: 10}}>
                    <Link onClick={this.historyHandler}>
                        <Typography variant="body2" color="textPrimary" align="center">
                            뒤로 가기
                        </Typography>
                    </Link>
                </Paper>
                <Paper style={{margin: '3% 30% 0 30%', padding: 50}}>
                    <Grid container>
                        <Grid xs={12} md={12} item style={{paddingRight: 10}}>
                            <TextField placeholder="Title"
                                       autoFocus
                                       fullWidth
                                       onChange={this.onInputTitleChange}
                                       value={this.state.item.title}
                                       inputProps={{style: {textAlign: 'center'}}}
                            />
                            <p/>
                            <label className="input-file-button" form="files">
                                업로드
                                <input type="file" id="files" multiple onChange={this.onInputFilesChange}
                                       style={{display: "none"}}/>
                            </label>
                            <p/>
                            <Typography variant="body2" color="textSecondary" align="center" component={'span'}>
                                <Carousel
                                    indicatorIconButtonProps={{
                                        style: {
                                            padding: '10px',
                                            color: 'pink',
                                            textAlign: "center",
                                        }

                                    }}
                                    indicatorContainerProps={{
                                        style: {
                                            textAlign: 'center' // 4
                                        }

                                    }}
                                >
                                    {this.state.item.filesBase64.map((image, idx) => {
                                        return (
                                            <img
                                                className="d-block w-100"
                                                key={idx}
                                                src={image}
                                                alt="First slide"
                                                style={{width: "100px", height: "100px", border: "1px solid"}}
                                            />
                                        );
                                    })}
                                </Carousel>
                            </Typography>
                            <p/>
                            <textarea placeholder={this.state.content}
                                      onChange={this.onInputContentChange}
                                      style={{
                                          width: '100%',
                                          height: '500px'
                                      }}
                                      id="textArea"/>
                            <p/>
                            <TextField placeholder={this.state.price}
                                       fullWidth
                                       onChange={this.onInputPriceChange}
                                       value={this.state.item.price}
                                       inputProps={{style: {textAlign: 'center'}}}
                            />
                            <p/>
                            <FormControl fullWidth>
                                <NativeSelect
                                    defaultValue={0}
                                    value={CATEGORIES[this.state.categoryNumber]}
                                    onChange={this.categoryChangeHandler}
                                >
                                    {
                                        CATEGORIES.map((category, idx) => {
                                            return <option
                                                key={idx}
                                                value={idx}
                                                style={{
                                                    textAlign: "center"
                                                }}
                                            >
                                                {category}
                                            </option>
                                        })
                                    }
                                </NativeSelect>
                            </FormControl>
                            <p/>
                            <Button className="submit-button"
                                    fullWidth
                                    onClick={this.onButtonClick}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                            >
                                업로드 하기
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </ThemeProvider>
        );
    }
}

export default UploadBoard;
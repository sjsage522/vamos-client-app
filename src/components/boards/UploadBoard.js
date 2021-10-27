import React from "react";
import Carousel from 'react-material-ui-carousel'
import {
    Button,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
    FormControl,
    NativeSelect,
} from "@material-ui/core";
import {uploadBoard} from "../../util/APIUtils";

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
                title: "",
                content: "",
                price: "",
                categoryNumber: 0,
                files: [],
                filesBase64: [],
            },
        };
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
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
        window.location.href = "/"
    }

    render() {
        return (
            <>
                <Paper style={{margin: '3% 30% 0 30%', padding: 10}}>
                    <Link href="/">
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
                            <input type="file" id="files" multiple onChange={this.onInputFilesChange}/>
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
                            <textarea placeholder="content"
                                      onChange={this.onInputContentChange}
                                      style={{
                                          width: '100%',
                                          height: '500px'
                                      }}
                            />
                            <p/>
                            <TextField placeholder="Price"
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
            </>
        );
    }
}

export default UploadBoard;
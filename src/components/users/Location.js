/*global daum*/
import React from 'react';
import {Button, Container, Grid, TextField, Typography, InputAdornment, Link, Paper} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {request} from "../../util/APIUtils";

class Location extends React.Component {
    constructor(props) {
        super(props);
        this.execDaumPostcode = this.execDaumPostcode.bind(this);
        this.settingUserLocation = this.settingUserLocation.bind(this);
        this.uploadLocationHandler = this.uploadLocationHandler.bind(this);
        this.state = {
            x: 0.,
            y: 0.,
            addressName: "",
        }
    }

    execDaumPostcode() {
        let mapContainer = document.getElementById('map'), // 지도를 표시할 div
            mapOption = {
                center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
                level: 5 // 지도의 확대 레벨
            };

        //지도를 미리 생성
        let map = new daum.maps.Map(mapContainer, mapOption);
        //주소-좌표 변환 객체를 생성
        let geocoder = new daum.maps.services.Geocoder();

        //마커를 미리 생성
        let marker = new daum.maps.Marker({
            position: new daum.maps.LatLng(37.537187, 127.005476),
            map: map
        });

        new daum.Postcode({
            oncomplete: (data) => {
                let addr = data.address;
                // 주소 정보를 해당 필드에 넣는다.
                document.getElementById("address").value = addr;

                // 주소로 상세 정보를 검색
                geocoder.addressSearch(data.address, (results, status) => {
                    // 정상적으로 검색이 완료됐으면
                    if (status === daum.maps.services.Status.OK) {

                        let result = results[0]; //첫번째 결과의 값을 활용

                        // 해당 주소에 대한 좌표를 받아서
                        let coords = new daum.maps.LatLng(result.y, result.x);
                        // 지도를 보여준다.
                        mapContainer.style.display = "block";
                        map.relayout();
                        // 지도 중심을 변경한다.
                        map.setCenter(coords);
                        // 마커를 결과값으로 받은 위치로 옮긴다.
                        marker.setPosition(coords);

                        const userLocationInfo = {
                            x: result.x,
                            y: result.y,
                            addressName: addr,
                        };
                        this.settingUserLocation(userLocationInfo);
                    }
                });
            }
        }).open();
    }

    settingUserLocation(userLocationInfo) {
        this.setState({
            x: userLocationInfo.x,
            y: userLocationInfo.y,
            addressName: userLocationInfo.addressName,
        })
    }

    uploadLocationHandler() {
        request("/user/location", "PATCH", {
            x: this.state.x,
            y: this.state.y,
            addressName: this.state.addressName,
        })
            .then(() => window.location.href = "/")
            .catch((error) => Promise.reject(error));
    }

    render() {
        return (
            <>
                <Container component="main" maxWidth="xs" style={{marginTop: "8%"}}>
                    <Paper style={{margin: '3% 30% 0 30%', padding: 10}}>
                        <Link href="/">
                            <Typography variant="body2" color="textPrimary" align="center">
                                뒤로 가기
                            </Typography>
                        </Link>
                    </Paper>
                    <p/>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5">
                                <TextField variant="outlined"
                                           autoFocus
                                           type="text"
                                           id="address"
                                           fullWidth
                                           InputProps={{
                                               endAdornment: (
                                                   <InputAdornment position="end">
                                                       <SearchIcon/>
                                                   </InputAdornment>
                                               ),
                                               style: {textAlign: 'center'},
                                           }}
                                />
                            </Typography>
                        </Grid>
                    </Grid>
                    <p/>
                    <Button onClick={this.execDaumPostcode}
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                    >
                        주소검색
                    </Button>
                    <p/>
                    <div id="map" style={{
                        width: '100%',
                        height: '300px',
                        display: 'flex'
                    }}>
                    </div>
                    <p/>
                    {this.state.addressName.length === 0 ? null :
                        <Button onClick={this.uploadLocationHandler}
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                        >
                            위치 설정
                        </Button>}
                </Container>
            </>
        );
    }
}

export default Location;
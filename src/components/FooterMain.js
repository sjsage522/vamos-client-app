import React from 'react';
import {Box, Typography} from "@material-ui/core";
import icon2 from "../img/icon2.png";
import "../components/FooterMain.css"

const FooterMain = () => {
    return (
    <Box mt={2} bottom={0} height={150} style={{backgroundColor:"darkgrey"}}>
        <div className="main">
            <div className="main_content">
                <img width="250px" height="70px" src={icon2} align="left" style={{marginTop:'3%'}}/>
                <div className="content2" style={{marginTop:'3%'}}>
                    안정성을 기반한 중고거래 사이트
                    <div className="content1" style={{marginTop:'3%'}}>
                        무엇이든 물어보세요!
                    </div>
                </div>

                <div className="footer_maincontent">
                    <div className="content3" style={{marginTop:'15%'}}>
                        이용약관
                        <div className="content4">
                            개인정보 약관
                        </div>
                        <div className="content5">
                            위치정보 약관
                        </div>
                    </div>

                </div>
            </div>
        </div>

        </Box>
    );
};

export default FooterMain;
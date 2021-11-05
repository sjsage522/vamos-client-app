import {Link, Paper, Typography, Container} from "@material-ui/core";
import React from "react";
import {BiLeftArrowAlt} from  "react-icons/bi";

class GoBackHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: this.props.history,
        }
    }

    historyHandler = () => {
        if (typeof this.state.history == 'undefined') window.location.href = "/";
        else this.state.history.goBack();
    }

    render() {
        return (
            <Container component="main" maxWidth="xs" style={{marginTop: "8%"}}>
            <Paper style={{margin: '3% 30% 0 30%', padding: 10}}>
                <Link onClick={this.historyHandler}>
                    <Typography variant="body2" color="textPrimary" align="center">
                        <BiLeftArrowAlt/> 뒤로 가기
                    </Typography>
                </Link>
            </Paper>
            </Container>
        );
    }
}

export default GoBackHistory
import React from "react";
import './NotFound.css';

export default class NotFound extends React.Component{
    render() {
        return (
            <div id="notfound">
                <div className="notfound">
                    <div className="notfound-404">
                        <h3>아무것도 없네요!</h3>
                        <h1><span>4</span><span>0</span><span>4</span></h1>
                    </div>
                    <h2>The page you requested was not found</h2>
                </div>
            </div>
        );
    }
}
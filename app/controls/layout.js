import React, {Component} from 'react';
import {Navbar} from "./navbar";
class Layout extends Component{
    render(){
        return (
            <div>
                <Navbar/>
                {this.props.children}
            </div>
        )
    }
}
export {Layout}

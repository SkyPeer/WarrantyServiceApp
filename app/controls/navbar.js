import React, {Component} from 'react';
import {Link} from "react-router-dom";
class Navbar extends Component{
    render(){
        return (
            <div>
                <Link to="/"> Main </Link>
                <Link to="/search"> Search </Link>
                <Link to="/tickets"> Tickets </Link>
                <Link to="/form"> Form </Link>
                <Link to="/servicecenters"> ServiceCentres </Link>
                <hr /><hr />
            </div>
        )
    }
}
export {Navbar}

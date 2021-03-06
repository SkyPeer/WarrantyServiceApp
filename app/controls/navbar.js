import React, {Component} from 'react';
import {NavLink} from "react-router-dom";

class Navbar extends Component{

    isActive = (link) => {
        return(link === document.location.pathname ? "active" : "normalLink");
    };

    myFunction() {
        const x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }

    render(){
        return (
            <div id="navBar">
            <div className="logo">ServiceApp</div>
                <div className="topnav" id="myTopnav">
                    <NavLink to="/" className={this.isActive('/')} >Главная</NavLink>
                    <NavLink to="/search" className={this.isActive('/search')}>Поиск</NavLink>
                    <NavLink to="/tickets" className={this.isActive('/tickets')}>Управление заявками</NavLink>
                    <NavLink to="/form" className={this.isActive('/form')}>Открыть заявку</NavLink>
                </div>
                <div id="menuIcon"><a href="javascript:void(0)" onClick={()=>{this.myFunction()}}><img src="../public/menu_bars5.png"/></a></div>
            </div>
        )
    }
}
export {Navbar}

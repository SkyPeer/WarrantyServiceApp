import React, {Component} from 'react';
import {Link, NavLink} from "react-router-dom";
class Navbar extends Component{
    render(){
        return (
            <div id="navBar"><ul>
                <li><NavLink to="/" activeClassName='is-active'>Главная</NavLink></li>
                <li><NavLink to="/search" activeClassName='is-active'>Поиск</NavLink></li>
                <li><NavLink to="/tickets" activeClassName='is-active'>Управление заявками</NavLink></li>
                <li><NavLink to="/form" activeClassName='is-active'>Открыть заявку</NavLink></li>
                <li><NavLink to="/servicecenters" activeClassName='is-active'> ServiceCentres </NavLink></li>
            </ul></div>
        )
    }
}
export {Navbar}

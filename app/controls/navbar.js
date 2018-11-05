import React, {Component} from 'react';
import {Link, NavLink, Route} from "react-router-dom";
//import activeComponent from "react-router-active-component";

class Navbar extends Component{
    state = {
        navLinks:[
            {to: '/', title: 'Главная', className: "normal"},
            {to: '/search', title: 'Поиск', className: "normal"},
            {to: '/tickets', title: 'Управление заявками', className: "normal"}
        ]
    };

    isActive = (link) => {
        link === document.location.pathname ? "active" : "normal"
        //console.log('link test:', link === document.location.pathname)
    }




    componentDidMount() {
        console.log(document.location.pathname)
    }

    render(){

        //let isActive = this.context.router.route.location.pathname === this.props.to;
       // let className = isActive ? 'active' : '';

        /* OLD LINKS*/
        /*
        <NavLink to="/" className='normal' id={()=>this.isActive('/')}>Главная</NavLink>
        <NavLink to="/search" className="normal"  activeClassName={this.isActive('/search')}>Поиск</NavLink>
        <NavLink to="/tickets" className="normal" activeClassName={this.isActive('/search')}>Управление заявками</NavLink>
        <NavLink to="/form" className="normal"  activeClassName={this.isActive('/search')}>Открыть заявку</NavLink>
        <NavLink to="/servicecenters" className="normal" activeClassName={this.isActive('/search')}> ServiceCentres </NavLink>
        */

        return (
            <div id="navBar">
                {
                    this.state.navLinks.map(navLink)
                }

            </div>
        )
    }
}
export {Navbar}

import React, {Component} from 'react';
import {Link, NavLink, Route} from "react-router-dom";
//import activeComponent from "react-router-active-component";

class Navbar extends Component{
   /* state = {
        navLinks:[
            {to: '/', title: 'Главная', className: "normal"},
            {to: '/search', title: 'Поиск', className: "normal"},
            {to: '/tickets', title: 'Управление заявками', className: "normal"}
        ]
    };*/

    isActive = (link) => {
        return(link === document.location.pathname ? "active" : "normal");
     //   console.log('link test:', link === document.location.pathname)
    };


    componentDidMount() {
      //  console.log(document.location.pathname)
    }

    render(){

        //let isActive = this.context.router.route.location.pathname === this.props.to;
       // let className = isActive ? 'active' : '';

        //<NavLink to="/servicecenters" className={this.isActive('/servicecenters')}> ServiceCentres </NavLink>

        return (
            <div id="navBar">
                <NavLink to="/" className={this.isActive('/')} >Главная</NavLink>
                <NavLink to="/search" className={this.isActive('/search')}>Поиск</NavLink>
                <NavLink to="/tickets" className={this.isActive('/tickets')}>Управление заявками</NavLink>
                <NavLink to="/form" className={this.isActive('/form')}>Открыть заявку</NavLink>

            </div>
        )
    }
}
export {Navbar}

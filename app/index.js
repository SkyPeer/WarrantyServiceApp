import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
import {render} from 'react-dom'
import 'react-dropdown/style.css'
import {Main} from "./pages/main";
import {TicketsComponent} from "./pages/tickets"
import {Search} from "./pages/search";
import {Form} from "./pages/form";
import {ServiceCentres} from "./pages/servicecenters";
import {DescComponent} from "./pages/tickets/othertickets"
import {Layout} from "./controls/layout";
import {statusOptions, typeOfServiceOptions, ticketPriorityOptions, placeOptions} from "./pages/props"


const Routing = () => (
    <Switch>
        <Route exact path='/' component={Main}/>
        <Route path='/tickets/:ticketid' component={DescComponent}/>
        <Route path='/tickets' component={TicketsComponent}/>
        <Route path='/search/:ticketid' component={Search}/>
        <Route path='/search' component={Search}/>
        <Route path='/form' component={Form}/>
        <Route path='/servicecenters' component={ServiceCentres}/>
    </Switch>
);

render(
    <BrowserRouter>
        <Routing />
    </BrowserRouter>,
    document.getElementById('root'));

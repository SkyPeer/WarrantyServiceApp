import React, {Component} from 'react';
import {HashRouter, BrowserRouter, Switch, Route, Link} from 'react-router-dom';
import {render} from 'react-dom'
import {Main} from "./pages/main";
import TicketsComponent from "./pages/tickets"
import {Search} from "./pages/search";
import {Form} from "./pages/form";
import {ServiceCentres} from "./pages/servicecenters";
import {DescComponent} from "./pages/tickets/othertickets"
import {Layout} from "./controls/layout";
import { connect } from 'react-redux';

import { Provider } from 'react-redux';
import store from './redux-store';


const Routing = () => (
    <Switch>
        <Route exact path='/' component={Main}/>
        <Route path='/tickets/:ticketid' component={DescComponent}/>
        <Route path='/tickets' component={TicketsComponent} store={store} />
        <Route path='/search/:ticketid' component={Search}/>
        <Route path='/search' component={Search}/>
        <Route path='/form' component={Form}/>
        <Route path='/servicecenters' component={ServiceCentres}/>
    </Switch>
);

render(
        <BrowserRouter>
              <Provider store={store}>
                <Routing />
              </Provider>
        </BrowserRouter>,
    document.getElementById('root'));

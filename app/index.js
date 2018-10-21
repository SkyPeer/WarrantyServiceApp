import React, {Component} from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { render } from 'react-dom'

class RouterComponent extends Component{
    state = {
        data: [],
        openTask: null
    };

    componentDidMount() {
        fetch(`/mongooseGetData`)
            .then(res => res.json())
            .then(json => this.setState({data: json}))
    }

    render(){
        return(
            <div>

                <ul>
                    {
                        this.state.data.map((ticket) => (
                            <li key={ticket._id}>
                                <div>
                                    <div>Заявка {ticket.ticketNumber} от {ticket.ticketDate} приоритет {ticket.ticketPriority}</div>
                                    <div>Инициатор {ticket.firstname +' '+ ticket.lasname + ' '+ ticket.familyname}</div>
                                    <Link to={`${ticket._id}`}>Подробнее об оборудовании {ticket.vendor} {ticket.model}</Link>
                                    <hr />
                                </div>
                            </li>

                        ))}
                </ul>
            </div>
        )
    }
}// end of RouterComponent


class NewDeafultComponent extends Component{
    state =
        {
            data : {}
        };


    arg = this.props.match.params.number;
    foo = console.log('NewDeafultComponent, this.arg: ',this.arg);

    componentDidMount() {

        fetch('/mongoosefind', {
            method: 'post',
            body: JSON.stringify({_id: this.arg}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => this.setState({data: json}))
            .then(()=>{console.log(this.state.data)})
    };


    render(){
        return(
            <div>
                <h5>Title: {this.state.data.ticketNumber}</h5>
                <h5>Desc: {this.state.data.problem}</h5>
                <Link to={'/'}>home</Link>
            </div>);
    }

} //NewDeafultComponent


const Routing = () => (
    <Switch>
        <Route exact path='/' component={RouterComponent}/>
        <Route path='/:number' component={NewDeafultComponent}/>
    </Switch>
);


const Api = () => (
    <RouterComponent />,
        <Routing />
);

render(
    <BrowserRouter>
        <Api/>
    </BrowserRouter>,
    document.getElementById('root'));

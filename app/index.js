import React, {Component} from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { render } from 'react-dom'

class TicketsComponent extends Component{
    state = {
        data: [],
        openTicketDescId: null
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
                                    <div>Заявка {ticket.ticketNumber} от {ticket.ticketDate} приоритет: {ticket.ticketPriority} Статус: {ticket.status}</div>
                                    <div>Инициатор {ticket.firstname +' '+ ticket.lasname + ' '+ ticket.familyname}</div>
                                    <Link to={`${ticket._id}`}>Подробнее об оборудовании {ticket.vendor} {ticket.model}</Link>

                                    <div>

                                        {ticket._id === this.state.openTicketDescId && (
                                            <section>

                                                <OpenDescComponent
                                                    problem={ticket.problem}
                                                    contacts={
                                                        {
                                                            telnum: ticket.telnum,
                                                            email: ticket.email,
                                                            extum: ticket.extnum
                                                        }
                                                    }
                                                />
                                            </section>)
                                        }
                                        <button onClick={()=>{this.setState({openTicketDescId:ticket._id})}}>OPEN</button>
                                        <button onClick={()=>{this.setState({openTicketDescId:null})}}>CLOSE</button>
                                    </div>
                                    <hr />
                                </div>
                            </li>))}
                </ul>
            </div>
        )}
}// end of RouterComponent

class OpenDescComponent extends  Component {
    render(){
        return(
        <div className="OpenDescComponent">
            <div>Причина: {this.props.problem}</div>
            <br />
            <div>Контакты:</div>

            <div>Email: <a href={"mailto:" + this.props.contacts.email}>{this.props.contacts.email +' '}</a>
                 Тел.: {this.props.contacts.telnum +' '}
                 Внутр: {this.props.contacts.extum +' '}
            </div>

               <input defaultValue={this.props.problem}/>


        </div>

        )
    }
}


class DescComponent extends Component{
    state = {data : {}};

    arg = this.props.match.params.ticketid;
    foo = console.log('DescComponent, this.arg: ',this.arg);

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
    };


    render(){
        return(
            <div>
                <h5>Title: {this.state.data.ticketNumber}</h5>
                <h5>Desc: {this.state.data.problem}</h5>
                <Link to={'/'}>Обратно к заявкам</Link>
            </div>);
    }

} //NewDeafultComponent


const Routing = () => (
    <Switch>
        <Route exact path='/' component={TicketsComponent}/>
        <Route path='/:ticketid' component={DescComponent}/>
    </Switch>
);



const Api = () => (
    <TicketsComponent />,
        <Routing />
);

render(
    <BrowserRouter>
        <Api/>
    </BrowserRouter>,
    document.getElementById('root'));

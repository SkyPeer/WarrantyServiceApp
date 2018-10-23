import React, {Component} from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { render } from 'react-dom'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import {Main} from "./pages/main";
import {Search} from "./pages/search";
import {Form} from "./pages/form";
import {Layout} from "./controls/layout";

class TicketsComponent extends Component{
    state = {
        data: [],
        openTicketDescId: null,
        idOfupdatedTicket: null,
        sc: []
    };


    getAllData () {
        fetch(`/mongooseGetDataTickets`)
            .then(res => res.json())
            .then(json => this.setState({data: json}));
        fetch(`/mongooseGetDataSC`)
            .then(res => res.json())
            .then(json => this.setState({sc: json}))
            .then(()=>{console.log(' --- sc: ', this.state.sc)})
    }

    updateDataFunc = (updatearg, id) => {
        console.log('clickFunc', updatearg, id);

            fetch('/mongooseUpdate', {
                method: 'post',
                /*body: JSON.stringify({
                    _id: id,
                    status: updatearg.status
                }), */
                body: JSON.stringify({
                    _id: id,
                    /*comment: updatearg.comment,
                    status: updatearg.status,
                    place: updatearg.place,
                    finishDate: updatearg.finishDate,
                    serviceCentre: updatearg.serviceCentre,
                    serviceCenterTicket: updatearg.serviceCentreTicket,
                    typeOfservice: updatearg.typeOfservice */
                    ...updatearg

                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(checkStatus)
                .then(()=>console.log('updated'))
                .then(()=>this.getAllData())
                .then(()=>this.setState({idOfupdatedTicket: id, openTicketDescId: null}));

            function checkStatus(response) {
                if (response.status >= 200 && response.status < 300) {
                    return response
                } else {
                    let error = new Error(response.statusText);
                    error.response = response;
                    throw error
                }
            }
    };


    componentDidMount() {
        this.getAllData();
    }

    statusOptions = [
        { value: 0, label: 'Новая' },
        { value: 1, label: 'Необходимы уточнения' },
        { value: 2, label: 'В работе' },
        { value: 3, label: 'Завершена' },
        { value: 4, label: 'Отклонена' },
    ];
    typeOfServiceOptions = [
        {value: 0, label: 'Гарантийный'},
        {value: 1, label: 'Не гарантийный'}
    ];

    ticketPriorityOptinons = [
        {value: 0, label: "Низкий"},
        {value: 1, label: "Средний"},
        {value: 2, label: "Высокий"}
    ];


    render(){
        return(
            <Layout>
                    {this.state.data.map((ticket) => (
                            <div key={ticket._id}>
                            <div>
                                <div>{this.state.idOfupdatedTicket === ticket._id ? <div>ОБНОВЛЕНА!!!</div> : ''}
                                Заявка {ticket.ticketNumber} от {ticket.ticketDate} {ticket.finishDate ? 'Дата завершения: '+ticket.finishDate + ' ' : ''}
                                приоритет: {this.ticketPriorityOptinons[ticket.ticketPriority].label} Статус: {this.statusOptions[ticket.status].label}</div>
                                <div>Инициатор {ticket.firstname +' '+ ticket.lasname + ' '+ ticket.familyname}</div>
                                <Link to={'/list/'+ticket._id}>Подробнее об оборудовании {ticket.vendor} {ticket.model}</Link>

                                    <div>

                                        {ticket._id === this.state.openTicketDescId && (
                                            <section>

                                                <OpenDescComponent
                                                    contacts={{telnum: ticket.telnum, email: ticket.email, extum: ticket.extnum}}
                                                    idshnik={ticket._id}
                                                    ticketNumber={ticket.ticketNumber}
                                                    problem={ticket.problem}
                                                    projectCode={ticket.projectCode}
                                                    place={ticket.place}
                                                    status={ticket.status} statusOptions={this.statusOptions}
                                                    finishDate={ticket.finishDate}

                                                    comment={ticket.comment}
                                                    saveButtonClick={(updatearg)=>{this.updateDataFunc(updatearg, ticket._id)}}
                                                    ticketPriority={ticket.ticketPriority} ticketPriorityOptions={this.ticketPriorityOptinons}

                                                    serviceCentre={ticket.serviceCentre}
                                                    typeOfService={ticket.typeOfService} typeOfServiceOptions={this.typeOfServiceOptions}
                                                    sc={this.state.sc}

                                                />
                                            </section>)
                                        }
                                        <button onClick={()=>{this.setState({openTicketDescId:ticket._id})}}>OPEN</button>
                                        <button onClick={()=>{this.setState({openTicketDescId:null})}}>CLOSE</button>
                                    </div>
                                    <hr />
                                </div>
                            </div>))}
            </Layout>
        )}
}// end of RouterComponent

class OpenDescComponent extends  Component {

    state = {
        comment: '',
        status: '',
        typeOfService: '',
        ticketPriority: '',
    };

    statusOptions = this.props.statusOptions;
    typeOfServiceOptions = this.props.typeOfServiceOptions;
    ticketPriorityOptions = this.props.ticketPriorityOptions;
    sc = this.props.sc;



    fullSetStateFunc = () => {
        console.log(' --- fullSetStateFunc');
        this.setState({
            comment: this.props.comment,
            status: this.props.status,
            typeOfService: this.props.typeOfService,
            ticketPriority: this.props.ticketPriority

        })
    };

    componentDidMount(){
        console.log('--componentDidMount');
      this.fullSetStateFunc()

    }

    resetForm = () => {
       this.fullSetStateFunc();
    };

    onChangeInputFunc = (event) => {
        console.log(event.target.value);
        this.setState({comment: event.target.value});
    };

    changePriority = (event) =>{
        console.log('changePriority', event.value);
        this.setState({ticketPriority: event.value})
    };

    changeStatus = (event) => {
        console.log('changeStatus', event.value);
        this.setState({status: event.value})
    };

    changeTypeOfService = (event) => {
        console.log('changeTypeOfService',event.value);
        this.setState({typeOfService: event.value})
    };

    clickFormFunc = () => {
        console.log('this.state', this.state);
        this.props.saveButtonClick({
            comment: this.state.comment,
            status: this.state.status,
            typeOfService: this.state.typeOfService,
            ticketPriority: this.state.ticketPriority
        });
    };

    render(){
        return(
            <form id="OpenDescComponent" onSubmit={(event)=>{event.preventDefault()}}>
                <div>Key: {this.props.idshnik} </div>
                <div>Причина: {this.props.problem}</div><br />
                <div>Код проекта: {this.props.projectCode}</div><div>Местонахождение оборудования: {this.props.place}</div><br />
                <div>Контакты:</div>
                <div>Email:<a href={"mailto:" + this.props.contacts.email +"?subject=Заявка на гарантийное обслуживание № "+this.props.ticketNumber}>{this.props.contacts.email +' '}</a>
                 Тел.: {this.props.contacts.telnum +' '}
                 Внутр: {this.props.contacts.extum +' '}
                </div>
                <hr />
                <div>Коментарий:<input type="text" id="comment" value={this.state.comment} onChange={this.onChangeInputFunc} /><br />
                Сервисный центр: <input defaultValue={this.props.serviceCentre} /><br />
                Ремонт: <Dropdown id="typeOfService" options={this.typeOfServiceOptions} onChange={this.changeTypeOfService} value={this.typeOfServiceOptions[this.state.typeOfService]} placeholder="Гарантиный / Не гарантийный" /><br />
                Дата завершения ремонта <input defaultValue={this.props.finishDate}/><br />
                <label>Приоритет заявки:</label><Dropdown id="priority" options={this.ticketPriorityOptions} onChange={this.changePriority} value={this.ticketPriorityOptions[this.state.ticketPriority]} placeholder="Выберете приоритет заявки" />
                <label>Статус заявки:</label><Dropdown id="status" options={this.statusOptions} onChange={this.changeStatus} value={this.statusOptions[this.state.status]} placeholder="Выберете статус заявки" />

                <button onClick={this.clickFormFunc}> SAVE </button>
                <button onClick={()=>{this.resetForm()}}>Reset</button>


                <hr />
        </div>
        </form>
        )
    }
}

class DescComponent extends Component{
    state =
        {
            data:{}
        };
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
            <Layout>
                <h5>Title: {this.state.data.ticketNumber}</h5>
                <h5>Desc: {this.state.data.problem}</h5>
                <Link to={'../list'}>Обратно к заявкам</Link>
            </Layout>);
    }

} //NewDeafultComponent

const Routing = () => (
    <Switch>
        <Route exact path='/' component={Main}/>
        <Route path='/list/:ticketid' component={DescComponent}/>
        <Route path='/list' component={TicketsComponent}/>
        <Route path='/search' component={Search}/>
        <Route path='/form' component={Form}/>
    </Switch>
);


//const Api = () => (<TicketsComponent />,);

render(
    <BrowserRouter>
        <Routing />
    </BrowserRouter>,
    document.getElementById('root'));

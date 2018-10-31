import React, {Component} from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { render } from 'react-dom'
import 'react-dropdown/style.css'
import {Main} from "./pages/main";
import {Search} from "./pages/search";
import {Form} from "./pages/form";
import {ServiceCentres} from "./pages/servicecenters";
import {Layout} from "./controls/layout";
import {statusOptions, typeOfServiceOptions, ticketPriorityOptions} from "./pages/props"


class TicketsComponent extends Component{
    state = {
        data: [],
        openTicketDescId: null,
        idOfupdatedTicket: null,
        sc: [],
        ticketWasDeleted: false

    };

    getAllData () {
        fetch(`/mongooseGetDataTickets`)
            .then(res => res.json())
            .then(json => this.setState({data: json}));
        fetch(`/mongooseGetDataSC`)
            .then(res => res.json())
            .then(json => this.setState({sc: json}))
    }

    deleteData = (id) => {
        console.log('deleteTicket, id', id);

        fetch('/mongooseTicketDelete', {
            method: 'post',
            body: JSON.stringify({ _id: id }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(checkStatus)
            .then(()=>{this.setState({idOfupdatedTicket: null, ticketWasDeleted: true})})
            .then(this.getAllData())
            .then(()=>console.log('ticket deleted'));



        function checkStatus(responsee) {
            if (responsee.status >= 200 && responsee.status < 300) {
                //console.log(response);
                return responsee
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        }
    };

    promtToDelete = (ticketNumber, _id) => {

        let originalPrompt = window.prompt;
            let answer = originalPrompt("Для удаление заявки № " + ticketNumber + " лвведите ее номер для подтверждения");
        answer == ticketNumber ? this.deleteData(_id) : alert('Ошибка ввода, удаление отменено')
    };

    updateDataFunc = (updatearg, id) => {
            fetch('/mongooseUpdate', {
                method: 'post',
                body: JSON.stringify({
                    _id: id,
                    ...updatearg
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(checkStatus)
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
        console.log('componentDidMount');
        this.getAllData();
        this.timerGetAllData;

    }

    componentWillUnmount(){
        console.log('componentWillUnmount');
        clearInterval(this.timerGetAllData)
    }

    timerGetAllData = setInterval(() => {
    //console.log( "time" );
    this.getAllData()
    }, 5000);


    render(){
        return(
            <Layout>
                <div>{this.state.ticketWasDeleted && <div>Заявка удалена! <button onClick={()=>{this.setState({ticketWasDeleted:false})}}>OK</button></div> }</div>

                    {this.state.data.map((ticket) => (
                            <div key={ticket._id}>
                            <div>
                            <div>{this.state.idOfupdatedTicket === ticket._id && <div><b> --- ОБНОВЛЕНА!!! --- </b> <button onClick={ ()=>{this.setState({idOfupdatedTicket:null})} }>OK</button></div>}</div>
                            Заявка {ticket.ticketNumber} от {ticket.ticketDate} {ticket.finishDate ? 'Дата завершения: '+ticket.finishDate + ' ' : ''}
                            приоритет: {ticketPriorityOptions[ticket.ticketPriority].label} Статус: {statusOptions[ticket.status].label}</div>
                            <div>Инициатор {ticket.firstname +' '+ ticket.lasname + ' '+ ticket.familyname}</div>
                            <Link to={'/list/'+ticket._id}>Подробнее об оборудовании {ticket.vendor} {ticket.model}</Link>

                                    <div>
                                        {ticket._id === this.state.openTicketDescId && (
                                            <section>

                                                <OpenFormComponent
                                                    _id={ticket._id}
                                                    contacts={{telnum: ticket.telnum, email: ticket.email, extum: ticket.extnum}}
                                                    ticketNumber={ticket.ticketNumber}
                                                    problem={ticket.problem}
                                                    projectCode={ticket.projectCode}
                                                    place={ticket.place}
                                                    status={ticket.status} statusOptions={statusOptions}
                                                    finishDate={ticket.finishDate}

                                                    comment={ticket.comment}
                                                    ticketPriority={ticket.ticketPriority} ticketPriorityOptions={ticketPriorityOptions}

                                                    serviceCenter={ticket.serviceCenter} serviceCenterOptions={this.state.sc}
                                                    serviceCenterTicket={ticket.serviceCenterTicket}
                                                    typeOfService={ticket.typeOfService} typeOfServiceOptions={typeOfServiceOptions}

                                                    saveButtonClick={(updatearg)=>{this.updateDataFunc(updatearg, ticket._id)}}
                                                    deleteButtonClick={this.promtToDelete}

                                                />
                                            </section>)
                                        }
                                        <button onClick={()=>{this.setState({openTicketDescId:ticket._id})}}>OPEN</button>
                                        <button onClick={()=>{this.setState({openTicketDescId:null})}}>CLOSE</button>

                                    </div>
                                    <hr />
                                </div>
                            ))}
            </Layout>
        )}
}// end of RouterComponent

class OpenFormComponent extends  Component {

    state = {
        comment: '',
        status: '',
        typeOfService: '',
        ticketPriority: '',
        serviceCenter: '',
        serviceCenterDetails: '',
        serviceCenterTicket: '',
        finishDate: ''

    };

    statusOptions = this.props.statusOptions;
    ticketPriorityOptions = this.props.ticketPriorityOptions;
    serviceCenterOptions = this.props.serviceCenterOptions;
    ticketNumber = this.props.ticketNumber;
    _id = this.props._id;



    fullSetStateFunc = () => {
        this.setState({
            ...this.props
        });
        this.props.serviceCenter !== '' ? this.getServiceCenterDetails(this.props.serviceCenter) : ''
    };

    getServiceCenterDetails = (id) => {
        let scDetais = this.props.serviceCenterOptions.find(item => item._id === id)
        this.setState({serviceCenterDetails: scDetais})
    };

    componentDidMount(){
      this.fullSetStateFunc()
    }



    handleUserInput = (e) => {
        const name = e.target.id;
        const value = e.target.value;
        console.log(name, ' ', value);
        this.setState({[name]: value})
    };

    changeServiceCenter = (event) => {
        this.getServiceCenterDetails(event.target.value);
        this.setState({serviceCenter: event.target.value})

    };

    saveFormFunc = () => {
        this.props.saveButtonClick({
                ...this.state
        });
    };

    resetForm = () => {
        this.fullSetStateFunc();
    };


    render(){
        return(

            <form id="OpenDescComponent" onSubmit={(event)=>{event.preventDefault()}}>
                <div>Причина: {this.props.problem}</div><br />
                <div>Код проекта: {this.props.projectCode}</div><div>Местонахождение оборудования: {this.props.place}</div><br />
                <div>Контакты:</div>
                <div>Email:<a href={"mailto:" + this.props.contacts.email +"?subject=Заявка на гарантийное обслуживание № "+this.props.ticketNumber}>{this.props.contacts.email +' '}</a>
                 Тел.: {this.props.contacts.telnum +' '}
                 Внутр: {this.props.contacts.extum +' '}
                </div>

                <hr />

                <div>
                    <label>Коментарий:</label>
                    <input type="text" id="comment" value={this.state.comment} onChange={this.handleUserInput} />
                </div>
                    <br /><br />

                <div>
                <label>Сервисный центр: </label>
                    <select id="serviceCenter" onChange={this.changeServiceCenter} value={this.state.serviceCenter}>
                        <option value="" defaultValue>Выбрать сервисный центр</option>
                        {this.props.serviceCenterOptions.map(sc =>
                            <option key={sc._id} value={sc._id}>{sc.scTitle}</option>
                        )}
                    </select>
                    {this.state.serviceCenterDetails !== undefined ? <div><b>Адрес СЦ: </b>{this.state.serviceCenterDetails.scAdress} <br /> <b>Авторизация вендоров:</b> {this.state.serviceCenterDetails.scVendors}</div> : ''}
                </div>

                <div>
                <label>Ремонт: </label>
                    <select id="typeOfService" onChange={this.handleUserInput} value={this.state.typeOfService}>
                        {typeOfServiceOptions.map(typeOfService =>
                            <option key={typeOfService.value} value={typeOfService.value}>{typeOfService.label}</option>
                        )}
                    </select>
                </div>

                <div>
                    <label>Дата завершения обслуживания:</label>
                    <input id="finishDate" onChange={this.handleUserInput} value={this.state.finishDate}/>
                </div>

                <div>
                    <label>Сервисный контракт / № обращения</label>
                    <input id="serviceCenterTicket" onChange={this.handleUserInput} value={this.state.serviceCenterTicket}/>
                </div>
                <br /><br />

                <div>
                <label>Приоритет заявки:</label>
                    <select id="ticketPriority" className="selectPriority" onChange={this.handleUserInput} value={this.state.ticketPriority}>
                        {this.props.ticketPriorityOptions.map(priority =>
                            <option key={priority.value} value={priority.value}>{priority.label}</option>
                        )}
                    </select>
                </div>

                <div>
                    <label>Статус заявки:</label>
                    <select id="status" onChange={this.handleUserInput} value={this.state.status}>
                        {this.props.statusOptions.map(status =>
                            <option key={status.value} value={status.value}>{status.label}</option>
                        )}
                    </select>
                </div>

                    <button onClick={this.saveFormFunc}> SAVE </button>
                    <button onClick={this.resetForm}>RESET</button>
                    <button onClick={ () => {this.props.deleteButtonClick(this.ticketNumber, this._id)

                    } }>DELETE</button>
                <hr />

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
    //foo = console.log('DescComponent, this.arg: ',this.arg);

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
        <Route path='/tickets/:ticketid' component={DescComponent}/>
        <Route path='/tickets' component={TicketsComponent}/>
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

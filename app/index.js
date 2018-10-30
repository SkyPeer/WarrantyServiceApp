import React, {Component} from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { render } from 'react-dom'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import {Main} from "./pages/main";
import {Search} from "./pages/search";
import {Form} from "./pages/form";
import {ServiceCenters} from "./pages/sc";
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
            //.then(()=>{console.log(' --- sc: ', this.state.sc)})
    }



    updateDataFunc = (updatearg, id) => {
        //console.log('clickFunc', updatearg, id);

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
                //.then(()=>console.log('updated'))
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
        //console.log(this.state.data);
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

                                                    serviceCenter={ticket.serviceCenter} serviceCenterOptions={this.state.sc}
                                                    serviceCenterTicket={ticket.serviceCenterTicket}
                                                    typeOfService={ticket.typeOfService} typeOfServiceOptions={this.typeOfServiceOptions}



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
        serviceCenter: '',
        serviceCenterDetails: '',
        serviceCenterTicket: '',
        finishDate: ''

    };

    statusOptions = this.props.statusOptions;
    typeOfServiceOptions = this.props.typeOfServiceOptions;
    ticketPriorityOptions = this.props.ticketPriorityOptions;
    serviceCenterOptions = this.props.serviceCenterOptions;



    fullSetStateFunc = () => {
        //console.log(' --- fullSetStateFunc');
        this.setState({
            comment: this.props.comment,
            status: this.props.status,
            typeOfService: this.props.typeOfService,
            ticketPriority: this.props.ticketPriority,
            serviceCenter: this.props.serviceCenter,
            finishDate: this.props.finishDate,
            serviceCenterTicket: this.props.serviceCenterTicket

        });
        this.props.serviceCenter !== '' ? this.getServiceCenterDetails(this.props.serviceCenter) : '' /*console.log('fullSetStateFunc: serviceCenter Not checked') */


    };

    getServiceCenterDetails = (id) => {
        let scDetais = this.props.serviceCenterOptions.find(item => item._id === id)
        this.setState({serviceCenterDetails: scDetais})
    };

    componentDidMount(){
        //console.log('--componentDidMount');
      this.fullSetStateFunc()
    }

    changeComment = (event) => {
        //console.log(event.target.value);
        this.setState({comment: event.target.value});
    };

    changeFinishDate = (event) => {
        //console.log(event.target.value);
        this.setState({finishDate: event.target.value});
    };

    changeServiceCenterTicket = (event) => {
        //console.log(event.target.value);
        this.setState({serviceCenterTicket: event.target.value})
    };

    changePriority = (event) =>{
        //console.log('changePriority', event.target.value);
        this.setState({ticketPriority: event.target.value})
    };

    changeStatus = (event) => {
        //console.log('changeStatus', event.target.value);
        this.setState({status: event.target.value})
    };

    changeServiceCenter = (event) => {
        //console.log(event.target.value);
        this.getServiceCenterDetails(event.target.value);
        this.setState({serviceCenter: event.target.value})

    };

    changeTypeOfService = (event) => {
        //console.log('changeTypeOfService',event.target.value);
        this.setState({typeOfService: event.target.value})
    };

    saveFormFunc = () => {
        //console.log('this.state', this.state);
        this.props.saveButtonClick({
            comment: this.state.comment,
            status: this.state.status,
            typeOfService: this.state.typeOfService,
            ticketPriority: this.state.ticketPriority,
            serviceCenter: this.state.serviceCenter,
            serviceCenterTicket: this.state.serviceCenterTicket,
            finishDate: this.state.finishDate,

        });
    };
    resetForm = () => {
        this.fullSetStateFunc();
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
                <div>Коментарий:<input type="text" id="comment" value={this.state.comment} onChange={this.changeComment} /><br /><br />

                <label>Сервисный центр: </label><select className="selectServiceCenter" onChange={this.changeServiceCenter} value={this.state.serviceCenter}>
                        <option value="" defaultValue>Выбрать сервисный центр</option>
                        {this.props.serviceCenterOptions.map(sc =>
                            <option key={sc._id} value={sc._id}>{sc.scTitle}</option>
                        )}
                    </select>
                    {this.state.serviceCenterDetails !== undefined ? <div><b>Адрес СЦ: </b>{this.state.serviceCenterDetails.scAdress} <br /> <b>Авторизация вендоров:</b> {this.state.serviceCenterDetails.scVendors}</div> : ''}

                    <label>Ремонт: </label>
                    <select className="typeOfService" onChange={this.changeTypeOfService} value={this.state.typeOfService}>
                        {this.typeOfServiceOptions.map(typeOfService =>
                            <option key={typeOfService.value} value={typeOfService.value}>{typeOfService.label}</option>
                        )}
                    </select>

                    <label>Дата завершения обслуживания:</label><input onChange={this.changeFinishDate} value={this.state.finishDate}/>
                    <label>Сервисный контракт / № обращения</label><input onChange={this.changeServiceCenterTicket} value={this.state.serviceCenterTicket}/>
                    <br /><br />
                    <label>Приоритет заявки:</label>

                    <select className="selectPriority" onChange={this.changePriority} value={this.state.ticketPriority}>
                        {this.props.ticketPriorityOptions.map(priority =>
                            <option key={priority.value} value={priority.value}>{priority.label}</option>
                        )}
                    </select>

                    <label>Статус заявки:</label>

                    <select className="selectStatus" onChange={this.changeStatus} value={this.state.status}>
                        {this.props.statusOptions.map(status =>
                            <option key={status.value} value={status.value}>{status.label}</option>
                        )}
                    </select>

                    <button onClick={this.saveFormFunc}> SAVE </button>
                    <button onClick={this.resetForm}>Reset</button>

                    <button onClick={ ()=> {

                        //console.log('this.state.serviceCenter', this.state.serviceCenter);
                        //console.log('this.props.serviceCenterOptions: ', this.props.serviceCenterOptions)
                        //console.log('this.state.serviceCenterDetails: ',this.state.serviceCenterDetails)
                    }}> --- TEST --- </button>

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
        <Route path='/list/:ticketid' component={DescComponent}/>
        <Route path='/list' component={TicketsComponent}/>
        <Route path='/search' component={Search}/>
        <Route path='/form' component={Form}/>
        <Route path='/sc' component={ServiceCenters}/>
    </Switch>
);


//const Api = () => (<TicketsComponent />,);

render(
    <BrowserRouter>
        <Routing />
    </BrowserRouter>,
    document.getElementById('root'));

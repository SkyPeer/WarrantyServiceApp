import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {render} from 'react-dom'
/*import 'react-dropdown/style.css'*/
import {Layout} from "../../controls/layout";
import {statusOptions, typeOfServiceOptions, ticketPriorityOptions, placeOptions} from "../props";
import {OpenFormComponent} from "./form";
const getDate = require('../getDate');
import reduxStore from "../../redux-store";
import { connect } from 'react-redux';

class TicketsComponent extends Component {
    state = {
        data: [],
        openTicketDescId: null,
        idOfupdatedTicket: null,
        sc: [],
        ticketWasDeleted: false,
        finishDate: '',
        daysLeft: '',
        currentDate: '',
        scListWasUpadted: false,

        reduxCounter: ''

    };

    getAllData() {
        fetch(`/mongooseGetDataTickets`)
            .then(res => res.json())
            .then(json => this.setState({data: json.data, currentDate: json.currentDate}));
        fetch(`/mongooseGetDataSC`)
            .then(res => res.json())
            .then(json => this.setState({sc: json}))
    }

    deleteData = (id) => {
        fetch('/mongooseTicketDelete', {
            method: 'post',
            body: JSON.stringify({_id: id}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(checkStatus)
            .then(() => {
                this.setState({idOfupdatedTicket: null, ticketWasDeleted: true})
            })
            .then(this.getAllData());
            /*.then(() => console.log('ticket deleted'));*/


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
        let answer = originalPrompt("Для удаление заявки № " + ticketNumber + " введите ее номер для подтверждения");
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
            .then(() => this.getAllData())
            .then(() => this.setState({idOfupdatedTicket: id, openTicketDescId: null}));

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

    scListWasUpadtedHideFunc = () => {
        this.setState({scListWasUpadted: false})
    };

    insertServiceCenter = (saveData) => {
        fetch('/mongooseSCInsert', {
            method: 'post',
            body: JSON.stringify({
                ...saveData
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(checkStatus)
            .then(() => {
                this.setState({scListWasUpadted: true, openFormNewSc: false})
            });
            /*.then(() => console.log('new sc inserted'));*/

        function checkStatus(responsee) {
            if (responsee.status >= 200 && responsee.status < 300) {
                return responsee
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        }
    };

    getAllServiceCenters = () => {
        fetch(`/mongooseGetDataSC`)
            .then(res => res.json())
            .then(json => this.setState({sc: json}));
    };

    componentDidMount() {
        this.getAllData();
        this.timerGetAllData;

       // console.log(' --- reduxstore: ', reduxStore);

        //this.setState({reduxValue:store.getState()});
        //store.subscribe(()=>this.setState({reduxValue:store.getState()}));
        //store.subscribe(()=>this.reduxStore = store.getState())
        this.unsubscribeStore = reduxStore.subscribe(this.updateStateFromStore);
    }

    componentWillUnmount() {
        clearInterval(this.timerGetAllData);
        //store.unsubscribe()
        this.unsubscribeStore();
    }

   timerGetAllData = setInterval(() => {
        this.getAllData()
    }, 4000);


    getCurrentStateFromStore() {
        console.log(' --- reduxStore.getState().counter: ', reduxStore.getState().counter);
        return {
            reduxCounter: reduxStore.getState().counter,
        }
    }

    updateStateFromStore = () => {
        const currentState = this.getCurrentStateFromStore();
        //console.log('updateStateFromStore , : currentState : ', currentState.reduxCounter);
        this.setState({reduxCounter: currentState.reduxCounter});

    };




    render() {
        return (
            <Layout>
                <header>
                    <div className="header_title">Заявки на обслуживание</div>
                </header>
                <div id="additionalMenu">
                    <Link className='servicecentersLink' style={{color: 'white', textDecoration: 'none'}} to="/servicecenters">Сервисные центры</Link>
                </div>

                <div className="content">

                    <div>{this.state.ticketWasDeleted &&
                    <div className="ticketDeleteMessage">
                        <div className="ticketDeleteMessage_text">Заявка удалена!</div>
                        <button className="ticketDeleteMessage_button" onClick={() => {
                            this.setState({ticketWasDeleted: false})
                        }}>OK
                        </button>
                    </div> }
                    </div>

                    {this.state.data.map((ticket) => (
                        <div key={ticket._id}>

                            <div>{this.state.idOfupdatedTicket === ticket._id &&
                            <div className="ticketUpdateMessage"><span
                                className="ticketUpdateMessage_text"> Заявка № {ticket.ticketNumber} <b>обновлена!</b> </span>
                                <button className="ticketUpdateMessage_button" onClick={() => {
                                    this.setState({idOfupdatedTicket: null})
                                } }>OK
                                </button>
                            </div>}</div>


                            <div
                                className={this.state.openTicketDescId !== ticket._id ? 'content_ticket' : 'content_ticket open'}
                                style={this.state.openTicketDescId !== ticket._id ? {background: 'white'} : {background: '#550a5f'}}>


                                <div className="ticket_flex1">
                                    <div
                                        style={this.state.openTicketDescId !== ticket._id ? {color: '#550a5f'} : {color: 'white'} }
                                        className={ticket.status !== 4 ? 'ticketNumber' : 'ticketNumber_canceled' }>
                                        Заявка № <b>{' ' + ticket.ticketNumber}</b>
                                    </div>


                                    <div className="ticketDate">
                                        Cоздана {getDate(null, ticket.ticketDate).dateOfCreation}</div>
                                    <div className="status"> Статус: <span
                                        className={statusOptions[ticket.status].className}>{statusOptions[ticket.status].label}</span>
                                    </div>

                                </div>

                                <div className="ticket_flex2">

                                    <div>
                                        Инициатор {ticket.lastname + ' ' + ticket.firstname + ' ' + ticket.familyname}</div>

                                    <div>
                                        {
                                            (ticket.daysForService && ticket.status !== 3) && <div className="daysForService">
                                                <div
                                                    className="finishDate">
                                                    Завершение: {getDate(this.state.currentDate, ticket.ticketDate, ticket.daysForService).finishDate}

                                                    <span className="daysForService"> осталось:
                                                        <span className={getDate(this.state.currentDate, ticket.ticketDate, ticket.daysForService).daysLeftClass}>
                                                        {getDate(this.state.currentDate, ticket.ticketDate, ticket.daysForService).daysLeftLocal}
                                                        </span>
                                                         дн.
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className="ticketPriority">Приоритет: <span
                                        className={ticketPriorityOptions[ticket.ticketPriority].className}>{ticketPriorityOptions[ticket.ticketPriority].label}</span>
                                    </div>
                                </div>

                                <div className="ticket_flex3">
                                    <button
                                        className={this.state.openTicketDescId !== ticket._id ? 'ticketOpenCloseButton' : 'ticketOpenCloseButton open'}
                                        onClick={() => {
                                            this.state.openTicketDescId !== ticket._id ? this.setState({
                                                openTicketDescId: ticket._id,
                                                scListWasUpadted: false
                                            }) : this.setState({openTicketDescId: null, scListWasUpadted: false})
                                        }}>
                                        {this.state.openTicketDescId !== ticket._id ? 'Открыть' : 'Закрыть'}
                                    </button>
                                </div>
                            </div>

                            {ticket._id === this.state.openTicketDescId && (
                                <div>
                                    <section>
                                        <OpenFormComponent
                                            _id={ticket._id}
                                            contacts={{
                                                telnum: ticket.telnum,
                                                email: ticket.email,
                                                extum: ticket.extnum
                                            }}
                                            ticketNumber={ticket.ticketNumber}
                                            partNumber={ticket.partNumber}
                                            vendor={ticket.vendor}
                                            model={ticket.model}
                                            problem={ticket.problem}
                                            projectCode={ticket.projectCode}
                                            place={ticket.place} placeAnother={ticket.placeAnother}
                                            placeOptions={placeOptions}

                                            status={ticket.status} statusOptions={statusOptions}
                                            currentDate={this.state.currentDate}
                                            ticketDate={ticket.ticketDate}
                                            daysForService={ticket.daysForService}

                                            comment={ticket.comment}
                                            ticketPriority={ticket.ticketPriority}
                                            ticketPriorityOptions={ticketPriorityOptions}

                                            serviceCenter={ticket.serviceCenter} serviceCenterOptions={this.state.sc}
                                            serviceCenterTicket={ticket.serviceCenterTicket}
                                            typeOfService={ticket.typeOfService}
                                            typeOfServiceOptions={typeOfServiceOptions}

                                            saveButtonClick={(updatearg) => {
                                                this.updateDataFunc(updatearg, ticket._id)
                                            }}
                                            deleteButtonClick={this.promtToDelete}

                                            saveButtonClickSC={(newSC) => {
                                                this.insertServiceCenter(newSC)
                                            }}
                                            updateSpanClickSC={() => {
                                                this.getAllServiceCenters()
                                            }}
                                            scListWasUpdated={this.state.scListWasUpadted}
                                            scListWasUpadtedHideFunc={this.scListWasUpadtedHideFunc}


                                        />
                                    </section>
                                </div>)
                            }

                        </div>


                    ))}
                </div>
            </Layout>
        )
    }
}// end of RouterComponent

export {TicketsComponent}
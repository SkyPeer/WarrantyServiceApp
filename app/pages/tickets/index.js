import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {render} from 'react-dom'
import 'react-dropdown/style.css'
import {Layout} from "../../controls/layout";
import {statusOptions, typeOfServiceOptions, ticketPriorityOptions, placeOptions} from "../props"
import {OpenFormComponent} from "./form"

class TicketsComponent extends Component {
    state = {
        data: [],
        openTicketDescId: null,
        idOfupdatedTicket: null,
        sc: [],
        ticketWasDeleted: false,

        finishDate: '',
        daysLeft: '',
        currentDate: ''
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
        console.log('deleteTicket, id', id);

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
            .then(this.getAllData())
            .then(() => console.log('ticket deleted'));


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

    dateFunction = (ticketDate, daysLeft) => {

        let dateOfCreation = new Date(ticketDate);
        let finishDate = new Date(ticketDate);
        let currentDate = new Date(this.state.currentDate._now);

        finishDate.setDate(dateOfCreation.getDate()+parseInt(daysLeft));

        let daysLeftLocal = Math.round((finishDate - currentDate) / 1000 / 60 / 60/ 24);
        return {dateOfCreation: (dateOfCreation.getDate() + '/' + (dateOfCreation.getMonth()+parseInt(1)) + '/' +dateOfCreation.getFullYear()+' '+dateOfCreation.getHours()+':'+dateOfCreation.getMinutes()),
                finishDate: (finishDate.getDate() + '/' +(finishDate.getMonth()+parseInt(1)) + '/' +finishDate.getFullYear()),
                daysLeftLocal: daysLeftLocal}
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

    componentDidMount() {
        console.log('componentDidMount');
        this.getAllData();
        //this.timerGetAllData;
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
        clearInterval(this.timerGetAllData)
    }

    timerGetAllData = setInterval(() => {
        //console.log( "time" );
        this.getAllData()
    }, 5000);


    render() {
        return (
        <Layout>
            <header><div className="header_title">Заявки на обслуживание</div></header>
                <button onClick={()=>{console.log(this.state)}}> TEST </button>
                <div>{this.state.ticketWasDeleted && <div>Заявка удалена!
                    <button onClick={() => {
                        this.setState({ticketWasDeleted: false})
                    }}>OK
                    </button>
                </div> }</div>

            <div className="content">

                {this.state.data.map((ticket) => (
                    <div className="ticket" key={ticket._id}>
                        <div className="ticketUpdateMessage">{this.state.idOfupdatedTicket === ticket._id && <div><b> --- ОБНОВЛЕНА!!! --- </b>
                        <button onClick={ () => {this.setState({idOfupdatedTicket: null})} }>OK</button></div>}</div>

                        <div className="ticketNumber">Заявка № <b>{' ' + ticket.ticketNumber}</b></div>
                        <div className="status"> Статус: {statusOptions[ticket.status].label}</div>
                        <div className="ticketDate">Cоздана {this.dateFunction(ticket.ticketDate, ticket.daysForService).dateOfCreation + ' '}</div>
                        <div className="ticketPriority">Приоритет: {ticketPriorityOptions[ticket.ticketPriority].label}</div>

                        <div>
                            {
                                ticket.daysForService && <div className="daysForService">
                                    <div className="finishDate">Завершение обслуживания: {this.dateFunction(ticket.ticketDate, ticket.daysForService).finishDate + ' '}</div>
                                    <div className="daysForService">До завершения осталось: {this.dateFunction(ticket.ticketDate, ticket.daysForService).daysLeftLocal} дней </div>
                                </div>
                            }
                        </div>

                        <div>Инициатор {ticket.lastname + ' ' + ticket.firstname + ' ' + ticket.familyname}</div>
                        <Link to={'/tickets/' + ticket._id}>Другие заявки на <b>{ticket.vendor} {ticket.model} {ticket.partNumber}</b></Link>

                        <div>
                            {ticket._id === this.state.openTicketDescId && (
                                <section>

                                    <OpenFormComponent
                                        _id={ticket._id}
                                        contacts={{telnum: ticket.telnum, email: ticket.email, extum: ticket.extnum}}
                                        ticketNumber={ticket.ticketNumber}
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
                                        typeOfService={ticket.typeOfService} typeOfServiceOptions={typeOfServiceOptions}

                                        saveButtonClick={(updatearg) => {
                                            this.updateDataFunc(updatearg, ticket._id)
                                        }}
                                        deleteButtonClick={this.promtToDelete}

                                    />
                                </section>)
                            }
                            <button onClick={() => {
                                this.setState({openTicketDescId: ticket._id})
                            }}>OPEN
                            </button>
                            <button onClick={() => {
                                this.setState({openTicketDescId: null})
                            }}>CLOSE
                            </button>

                        </div>

                    </div>
                ))}
            </div>
        </Layout>
        )
    }
}// end of RouterComponent

export {TicketsComponent}
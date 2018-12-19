import React, {Component} from 'react';
import {Layout} from "../../controls/layout";
import {statusOptions} from "../props";
import store from "../../redux-store";
const getDate = require('../getDate');

class Search extends Component {
    state = {

        firstname: '',
        lastname: '',
        status: 0,
        ticketNumber: '',
        comment: '',

        search: '',
        cantFind: false,
        checkData: false,


    };
    searcharg = this.props.match.params.ticketid;

    inputUserHandler = (e) => {
        this.setState({search: e.target.value})
    };

    trySearch = (number) => {
        fetch('/mongooseSearchbyTicketNumber', {
            method: 'post',
            body: JSON.stringify({ticketNumber: number}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => this.checkData(json))
    };


    checkData = (ticket) => {
        JSON.stringify(ticket) !== JSON.stringify({error: 'mongoNotFound'}) ?
            this.setState({
                ...ticket.data,currentDate:ticket.currentDate, checkData: true, cantFind: false,
            }) : this.setState({checkData: false, cantFind: true})


    };


    componentDidMount() {
        this.searcharg !== undefined ? this.trySearch(this.searcharg) : '';
    };


    render() {
        return (
            <Layout>
                <header><div className="header_title">Найти заявку</div></header>

                <div className="content search">

                        <form className="searchForm" onSubmit={(event) => {
                            event.preventDefault()
                        }}>

                            <div className="searchForm_controls">

                                <input id="searchForm_ticketNumber" onChange={this.inputUserHandler} value={this.state.search}
                                                                        placeholder="введите номер заявки"/>

                                <button id="searchForm_button" onClick={() => {this.trySearch(this.state.search);}}>
                                    Поиск</button>

                            </div>


                            {this.state.checkData ?
                                <div className="searchForm_result"><br />
                                    <div><b>Инициатор: </b>{this.state.lastname + ' ' + this.state.firstname + ' ' + this.state.familyname}</div>
                                    <div><b>№ заявки: </b>{this.state.ticketNumber}</div>
                                    <div><b>Дата обращения: </b>{getDate(null, this.state.ticketDate).dateOfCreation}</div>
                                    {this.state.daysForService && <div>
                                        <b>Завершние заявки:</b> {getDate(this.state.currentDate, this.state.ticketDate, this.state.daysForService).finishDate +
                                    ' осталось: ' +  getDate(this.state.currentDate, this.state.ticketDate, this.state.daysForService).daysLeftLocal + ' дн.'}
                                    </div>}
                                    <div><b>Статус: </b>{this.state.status !== 0 ? statusOptions[this.state.status].label : 'На рассмотрении'}</div>
                                </div>
                                : ''}
                            {
                                this.state.cantFind ? <div className="search_error">Заявки с таким номером не существует</div> : ''
                            }
                        </form>

                </div>

            </Layout>

        )
    }
}

export {Search}

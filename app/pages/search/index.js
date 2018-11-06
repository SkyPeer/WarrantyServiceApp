import React, {Component} from 'react';
import {Layout} from "../../controls/layout";
import {statusOptions} from "../props"

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


    checkData = (data) => {
        console.log(data);
        JSON.stringify(data) !== JSON.stringify({error: 'mongoNotFound'}) ?
            this.setState({
                ...data, checkData: true, cantFind: false,
            }) : this.setState({checkData: false, cantFind: true})


    };


    componentDidMount() {
        console.log('this.searcharg: ', this.searcharg);
        this.searcharg !== undefined ? this.trySearch(this.searcharg) : ''
        //this.setState({search:this.searcharg})


    };


    render() {
        return (
            <Layout>
                <form onSubmit={(event) => {
                    event.preventDefault()
                }}>
                    <header><div className="header_title">Найти заявку</div></header>
                    <input id="ticketNumber" onChange={this.inputUserHandler} value={this.state.search}
                           placeholder="введите номер заявки"/>
                    <button onClick={() => {this.trySearch(this.state.search);}}>Поиск</button>

                    {this.state.checkData ?
                        <div><br />
                            <div>
                                <b>Инициатор: </b>{this.state.lastname + ' ' + this.state.firstname}
                            </div>
                            <div><b>№ заявки: </b>{this.state.ticketNumber}</div>
                            <div>
                                статус: {this.state.status !== 0 ? statusOptions[this.state.status].label : 'На рассмотрении'}</div>
                        </div>
                        : ''}
                    {
                        this.state.cantFind ? <div>Заявки с таким номером не существует</div> : ''
                    }
                </form>
            </Layout>

        )
    }
}

export {Search}

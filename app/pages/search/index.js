import React, {Component} from 'react';
import {Layout} from "../../controls/layout";
import {statusOptions} from "../props"
const isNumber = require('is-number');

class Search extends Component {
    state = {
        data: {},

        checkData: '',
        search: false,
        buttonEnabled: true,
        inputError: false
    };
    arg = this.props.match.params.ticketid;
    //foo = console.log('DescComponent, this.arg: ',this.arg);

    inputUserHandler = (e) => {
        console.log(e.target.value);

        isNumber(e.target.value) ? this.setState({
            buttonEnabled: true,
            inputError: false
        }) : this.setState({buttonEnabled: false, inputError: true});

        e.target.value === '' ? this.setState({inputError: false}) : '';

        this.setState({ticketNumber: e.target.value})

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
            /*.then(json => this.setState({data: json})) */
            .then(json => this.checkData(json))
    };


    checkData = (data) => {
        console.log(data);
        data !== null ? this.setState({data: data, checkData: true}) : this.setState({checkData: false});
    };

    componentDidMount() {
        console.log('this.arg',this.arg)
    };


    render() {
        return (
            <Layout>
                <form onSubmit={(event) => {
                    event.preventDefault()
                }}>
                    <h1>Search</h1>
                    <input id="ticketNumber" onChange={this.inputUserHandler} value={this.state.ticketNumber}
                           placeholder="введите номер заявки" className={this.state.inputError ? 'input_error2' : ''}/>
                    <div>{this.state.inputError && <span className="form__error">Номер заявки должен состоять только из чисел</span>}</div>
                    <button disabled={!this.state.buttonEnabled} onClick={() => {
                        this.trySearch(this.state.ticketNumber);
                        this.setState({search: true})
                    }}>Search
                    </button>
                    <button onClick={() => {
                        console.log(this.state.data)
                    }}>TEST
                    </button>

                    {
                        this.state.search &&
                        (this.state.checkData ?
                                <div><br />
                                    <div>
                                        <b>Инициатор: </b>{this.state.data.lasname + ' ' + this.state.data.firstname + ' ' + this.state.data.familyname}
                                    </div>
                                    <div><b>№ заявки: </b>{this.state.data.ticketNumber}, дата и время
                                        создания: {this.state.data.ticketDate} </div>
                                    <div> Коментарий: {this.state.data.comment},
                                        статус: {statusOptions[this.state.data.status].label}</div>
                                    <div><b>Дата завешения: </b> <u>{this.state.data.finishDate}</u></div>

                                </div>
                                :
                                <div>Заявка с таким номером не найдена</div>
                        )
                    }
                </form>
            </Layout>

        )
    }
}

export {Search}

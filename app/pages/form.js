import React, {Component} from 'react';
import {Layout} from "../controls/layout";

class Form extends Component{
    state =  {
        firstname: '',
        lastname: '',
        familyname: '',
        email: '',
        telnum: '',
        extnum: '',

        type: '',
        vendor: '',
        model: '',
        partNumber: '',
        problem: '',
        place: '',
        projectCode: '',

        ticketPriority: '',

        ticketNumber: ''
    };

    componentDidMount(){
        fetch(`/getTicketRandomNumber`)
            .then(res => res.json())
            .then((json) => {
            console.log(json)
            this.setState({ticketNumber: json.ticketNumber})
        })

    }

    firstNameChange = (event) => {
        console.log('firstNameChange', event.target.value);
        this.setState({firstname:event.target.value})
    };

    lastNameChange = (event) => {
        console.log('lastNameChange', event.target.value);
        this.setState({lastname:event.target.value})
    };

    familyNameChange = (event) => {
        console.log('familyNameChange', event.target.value);
        this.setState({familyname:event.target.value})
    };

    emailChange = (event) => {
        console.log('emailChange', event.target.value);
        this.setState({email:event.target.value})
    };

    telnumChange = (event) => {
        console.log('telnumnChange', event.target.value);
        this.setState({telnum:event.target.value})
    };

    extnumChange = (event) => {
        console.log('extnumChange', event.target.value);
        this.setState({extum:event.target.value})
    };


    render(){
        return (
            <Layout>
                <h1>Form</h1>
                <h5>Номер заявки {this.state.ticketNumber} и дата</h5>
                <form>
                    <hr />
                    <div><b>Инициатор:</b></div>
                    <label>Имя: </label><input onChange={this.firstNameChange}/><br />
                    <label>Фамилия: </label><input onChange={this.lastNameChange}/><br />
                    <label>Отчество: </label><input onChange={this.familyNameChange}/><br />
                    <label>E-mail:</label><input onChange={this.emailChange}/><br />
                    <label>моб. телефон: </label><input onChange={this.telnumChange}/><br />
                    <label>внутр. №: </label><input onChange={this.extnumChange}/><br />
                    <hr />

                </form>
                <button onClick={()=>{console.log(this.state.ticketNumber)}}>отправить</button>
            </Layout>
        )
    }
}
export {Form}

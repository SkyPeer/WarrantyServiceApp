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
            console.log(json);
            this.setState({ticketNumber: json.ticketNumber})
        })

    }

    ticketPriorityOptions = [
        {value: 0, label: "Низкий"},
        {value: 1, label: "Средний"},
        {value: 2, label: "Высокий"}
    ];

    placeOptions = [
        {value: 0, label: "Головной офис"},
        {value: 1, label: "Доп. офис №1"},
        {value: 2, label: "Доп. офис №2"},
        {value: 3, label: "Склад"},
        {value: 4, label: "Заказчик"},
        {value: 5, label: "Другое"}
    ];


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

    changePriority = (event) =>{
        console.log('changePriority', event.target.value);
        this.setState({ticketPriority: event.target.value})
    };

    changePlace = (event) =>{
        console.log('changeplace', event.target.value);
        this.setState({place: event.target.value})
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


                    <label>Производитель / вендор: </label><input onChange={this.vendorChange}/><br />
                    <label>Модель: </label><input onChange={this.modelChange}/><br />
                    <label>P/N: </label><input onChange={this.partNumberChange}/><br />
                    <label>Описание проблемы:</label><br /><textarea onChange={this.problemChange}></textarea><br />
                    <label>Код проекта</label><input onChange={this.projectCodechange}></input><br />

                    <label>Местонахождение оборудования: </label><select className="selectPlace" onChange={this.changePlace} value={this.state.place}>
                        {this.placeOptions.map(place =>
                            <option key={place.value} value={place.value}>{place.label}</option>
                        )}
                    </select>
                    <br />

                    <label>Приоритет заявки: </label><select className="selectPriority" onChange={this.changePriority} value={this.state.ticketPriority}>
                        {this.ticketPriorityOptions.map(priority =>
                            <option key={priority.value} value={priority.value}>{priority.label}</option>
                        )}
                    </select>




                </form>
                <button onClick={()=>{console.log(this.state.ticketNumber)}}>отправить</button>
            </Layout>
        )
    }
}
export {Form}

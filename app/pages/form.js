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
        placeAnother: '',
        projectCode: '',
        ticketPriority: 0,

        newTicketNumber: '',
        datetimeOfCreate: '',

    };


    saveData = () => {
        this.updateDataFunc(this.state)
    };

    updateDataFunc = (saveData) => {
        console.log('clickFunc', saveData);

        fetch('/mongooseInsert', {
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
            .then(checkStatus => checkStatus.json())
            .then((json)=> this.setState({
                newTicketNumber: json.resJson.ticketNumber,
                datetimeOfCreate: json.resJson.currnetDateTime}))
            .then(()=>console.log('inserted'));


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
        console.log('telnumnChange:', event.target.value);
        this.setState({telnum:event.target.value})
    };

    extnumChange = (event) => {
        console.log('extnumChange', event.target.value);
        this.setState({extnum:event.target.value})
    };

    changePriority = (event) =>{
        console.log('changePriority:', event.target.value);
        this.setState({ticketPriority: event.target.value})
    };

    placeChange = (event) =>{
        console.log('changePlace:', event.target.value);
        this.setState({place: event.target.value})
    };

    placeAnotherChange = (event) =>{
        console.log('changeAnotherPlace:', event.target.value);
        this.setState({placeAnother: event.target.value})
    };

    vendorChange = (event) =>{
        console.log('changeVendor:', event.target.value);
        this.setState({vendor: event.target.value})
    };

    modelChange = (event) =>{
        console.log('changeModel:', event.target.value);
        this.setState({model: event.target.value})
    };

    partNumberChange = (event) =>{
        console.log('changepartNumber:', event.target.value);
        this.setState({partNumber: event.target.value})
    };

    problemChange = (event) =>{
        console.log('changepartProblem:', event.target.value);
        this.setState({problem: event.target.value})
    };

    projectCodechange = (event) =>{
        console.log('changeProjectCodec:', event.target.value);
        this.setState({projectCode: event.target.value})
    };

    render(){
        return (
            <Layout>
                <h1>Form</h1>{this.state.newTicketNumber !== '' ? <div>Создано обращение № {this.state.newTicketNumber + '  ' + this.state.datetimeOfCreate} МСК</div> : ''}
                <form id="CreateTicket" onSubmit={(event)=>{event.preventDefault()}}>
                    <hr />
                    <div><b>Инициатор:</b></div>
                    <label>Имя</label>
                    <input id="name" placeholder="Имя" onChange={this.firstNameChange}/><br />

                    <label>Фамилия: </label>
                    <input onChange={this.lastNameChange}/><br />

                    <label>Отчество: </label>
                    <input onChange={this.familyNameChange}/><br />

                    <label>E-mail:</label>
                    <input onFocus={()=>{console.log('on Focus')}} onBlur={()=>{console.log('on blur')}}  onChange={this.emailChange}/><br />

                    <label>моб. телефон: </label>
                    <input onChange={this.telnumChange}/><br />

                    <label>внутр. №: </label>
                    <input onChange={this.extnumChange}/><br />
                    <hr />

                    <label>Производитель / вендор: </label>
                    <input onChange={this.vendorChange}/><br />

                    <label>Модель: </label>
                    <input onChange={this.modelChange}/><br />

                    <label>P/N: </label>
                    <input onChange={this.partNumberChange}/><br />

                    <label>Описание проблемы:</label>
                    <br /><textarea onChange={this.problemChange}></textarea><br />

                    <label>Код проекта: </label>
                    <input onChange={this.projectCodechange}></input><br />

                    <label>Местонахождение оборудования: </label><br />
                    <select className="selectPlace" onChange={this.placeChange} value={this.state.place}>
                        {this.placeOptions.map(place =>
                            <option key={place.value} value={place.value}>{place.label}</option>
                        )}
                    </select>{this.state.place === '5' ? <input onChange={this.placeAnotherChange}></input> : console.log('another place') }
                    <br /><br />

                    <label>Приоритет заявки: </label>
                    <select className="selectPriority" onChange={this.changePriority} value={this.state.ticketPriority}>
                        {this.ticketPriorityOptions.map(priority =>
                            <option key={priority.value} value={priority.value}>{priority.label}</option>
                        )}
                    </select>

                </form>
                <button onClick={this.saveData}>Отправить</button>
                <button onClick={()=>{this.setState({defaultstate})}}> Reset </button>
            </Layout>
        )
    }
}
export {Form}

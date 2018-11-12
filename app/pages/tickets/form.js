import React, {Component} from 'react';
import {render} from 'react-dom'
import 'react-dropdown/style.css'
import {Link} from 'react-router-dom';
import {ServiceCenterForm} from '../servicecenters/form'
const isNumber = require('is-number');
const getDate = require('../getDate');

class OpenFormComponent extends Component {

    state = {
        comment: '',
        status: '',
        typeOfService: '',
        ticketPriority: '',
        serviceCenter: '',
        serviceCenterDetails: '',
        serviceCenterTicket: '',
        finishDate: '',
        //finishDateLocal: '',
        daysForService: '',
        //formErrors: {},
        daysForServiceError: false,

        openFormNewSc: false,
        scListWasUpadted: '',
    };

    ticketDate = this.props.ticketDate;
    //daysForService = this.props.daysForService;
    currentDate = this.props.currentDate;
    statusOptions = this.props.statusOptions;
    ticketPriorityOptions = this.props.ticketPriorityOptions;
    serviceCenterOptions = this.props.serviceCenterOptions;
    ticketNumber = this.props.ticketNumber;
    place = this.props.place;
    placeAnother = this.props.placeAnother;
    typeOfService = this.props.typeOfService;
    typeOfServiceOptions= this.props.typeOfServiceOptions;
    _id = this.props._id;
    placeOptions = this.props.placeOptions;
    model=this.props.model;
    vendor=this.props.vendor;
    partNumber = this.props.partNumber;
    scListWasUpadted = this.props.scListWasUpadted;
    /*saveButtonClickSC = this.props.saveButtonClickSC;*/


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

    componentDidMount() {
        console.log('this.props',this.props);
        this.fullSetStateFunc()
    }

    handleUserInputDate = (e) => {
        let daysForService = e.target.value;
        console.log('input days: ',e.target.value);
        isNumber(daysForService) || daysForService == '' ?
            this.setState({daysForService: daysForService, daysForServiceError: false}) : this.setState({daysForServiceError: true})

        let ticketDate = new Date(this.ticketDate);
        let finishDate = new Date();
        finishDate.setDate(ticketDate.getDate());
        finishDate.setMonth(ticketDate.getMonth());
        finishDate.setFullYear(ticketDate.getFullYear());
        /*this.state.daysForService !== '' ? finishDate.setDate(this.ticketDate.getDate()+this.state.daysForService) : '';
        this.setState({finishDate:finishDate}) */

        //console.log(ticketDate);
        finishDate.setDate(ticketDate.getDate()+parseInt(daysForService));
        console.log(finishDate);

        isNumber(finishDate.getDate()) ?
            this.setState({finishDate:' '+ finishDate.getDate() +' / '+ (finishDate.getMonth()+parseInt(1)) +' / '+ finishDate.getFullYear() +' '}) :
            this.setState({finishDate: ''})
        //finishDate.setDate(35);

       // console.log(finishDate);
        //console.log(this.ticketDate);
    };

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

    clickSaveSCFunc = (args) =>{

        this.props.saveButtonClickSC(args);
        /*console.log('argss',argss);*/
        this.setState({openFormNewSc:false});
    };

    saveFormFunc = () => {
        this.props.saveButtonClick({
            ...this.state
        });
    };

    resetForm = () => {
        this.fullSetStateFunc();
    };


    render() {

        return (

            <form id="openDescForm" onSubmit={(event) => {
                event.preventDefault()
            }}>

                <div className="openDescForm_problem">

                    <div>Оборудование: <b>{this.vendor +' '+ this.model + '  P/N: ' + this.partNumber}</b><br /></div>
                        <div>Причина: {this.props.problem}</div>
                        <div>Код проекта: {this.props.projectCode}</div>
                        <div>Местонахождение оборудования: {this.place !== 5 ? ' ' + this.placeOptions[this.place].label + ' ' : ' ' + this.placeAnother + ' '}</div>
                        <div className="openDescForm_contacts">Контакты:
                            <div className="openDescForm_contacts_email">Email:<a href={"mailto:" + this.props.contacts.email + "?subject=Заявка на гарантийное обслуживание № " + this.props.ticketNumber}>{this.props.contacts.email + ' '}</a></div>
                            <div className="openDescForm_contacts_tel">Тел.: {this.props.contacts.telnum + ' ' + ' Внутр:' + this.props.contacts.extum + ' '}</div>
                    </div>
                </div>



                <div className="openDescForm_form">

                    <div className="openDescForm_form_comment">
                        <label>Коментарий:</label>
                        <textarea type="text" id="comment" placeholder="" value={this.state.comment} onChange={this.handleUserInput}/>
                    </div>

                     <div className="openDescForm_form_serviceCenter">
                         <label>Сервисный центр: </label><button className="refreshScListonForm">Обновить список</button>
                        <select id="serviceCenter" onChange={this.changeServiceCenter} value={this.state.serviceCenter}>
                            <option value="" defaultValue>Выбрать сервисный центр</option>
                            {this.props.serviceCenterOptions.map(sc =>
                                <option key={sc._id} value={sc._id}>{sc.scTitle}</option>
                        )}
                    </select>
                    {this.state.serviceCenterDetails !== undefined ?
                        <div><b>Адрес СЦ: </b>{this.state.serviceCenterDetails.scAdress} <b><br />
                            Авторизация вендоров: </b> {this.state.serviceCenterDetails.scVendors}</div> : ''}
                </div>
                    {this.props.scListWasUpdated && <div className="ticketUpdateMessage">
                        <div className="ticketUpdateMessage_text" style={{marginLeft: '15px'}}>Новый сервис-центр добавлен!</div>
                        <button className="ticketUpdateMessage_button" onClick={() => {
                            this.props.scListWasUpadtedHideFunc()}}>ОК!</button></div>}


                    <button className="addScButtononForm"
                            onClick={()=>{!this.state.openFormNewSc ? this.setState({openFormNewSc:true}) : this.setState({openFormNewSc:false})}}>
                        Добавить сервисный центр
                    </button>
                    <div className="ServiceCenterFormDiv">

                            {this.state.openFormNewSc ?
                                <ServiceCenterForm
                                    clickSaveFunc={(arg)=>this.clickSaveSCFunc(arg)}
                                    deleteResetButtonsEnabled={false}
                                 /> : ''}
                    </div>
                <div>
                    <label>Ремонт: </label>
                    <select id="typeOfService" onChange={this.handleUserInput} value={this.state.typeOfService}>
                        {this.typeOfServiceOptions.map(typeOfService =>
                            <option key={typeOfService.value} value={typeOfService.value}>{typeOfService.label}</option>
                        )}
                    </select>
                </div>

                <div className="openDescForm_form_daysForService">
                    <label>Время на проведение сервсных работ:</label>

                    <input id="daysForService"
                           onChange={this.handleUserInputDate}
                           value={this.state.daysForService}
                           placeholder="Введите количество дней (от даты заявки)"/>
                    {this.state.daysForService &&<div>Дата завершения: {getDate(this.currentDate, this.ticketDate, this.state.daysForService).finishDate}</div> }

                    { this.state.daysForServiceError && <span className="form__error">Необходимо ввести количество дней</span>}

                    { /*this.state.finishDate !== '' ? <div>Дада завершения: {this.state.finishDate}</div> : '' */ }
                </div>

                <div>
                    <label>Сервисный контракт / № обращения</label>
                    <input id="serviceCenterTicket" onChange={this.handleUserInput}
                           value={this.state.serviceCenterTicket}/>
                </div>
                <br /><br />

                <div>
                    <label>Приоритет заявки:</label>
                    <select id="ticketPriority" className="selectPriority" onChange={this.handleUserInput}
                            value={this.state.ticketPriority}>
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

                </div>

                <button className="openDescForm_form_button save" onClick={this.saveFormFunc}>Сохранить</button>
                <button className="openDescForm_form_button reset" onClick={this.resetForm}>Сбросить</button>
                <button className="openDescForm_form_button delete" onClick={ () => {this.props.deleteButtonClick(this.ticketNumber, this._id)} }>Удалить</button>


            </form>
        )
    }
}
export {OpenFormComponent}

import React, {Component} from 'react';
import {render} from 'react-dom'
import 'react-dropdown/style.css'
const isNumber = require('is-number');

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

        //formErrors: {},
        daysForService: '',
        daysForServiceError: false

    };

    ticketDate = this.props.ticketDate;
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
        this.fullSetStateFunc()
    }

    handleUserInputDate = (e) => {
        let daysForService = e.target.value;
        console.log('input days: ',e.target.value);
        isNumber(daysForService) || daysForService == '' ? this.setState({daysForService: daysForService, daysForServiceError: false}) : this.setState({daysForServiceError: true})

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

            <form id="OpenDescComponent" onSubmit={(event) => {
                event.preventDefault()
            }}>
                <div>Причина: {this.props.problem}</div>
                <br />
                <div>Код проекта: {this.props.projectCode}</div>

                <div>Местонахождение оборудования:
                    {this.place !== 5 ? ' ' + this.placeOptions[this.place].label + ' ' : ' ' + this.placeAnother + ' '}
                </div>

                <br />

                <div>Контакты:</div>
                <div>Email:<a href={"mailto:" + this.props.contacts.email + "?subject=Заявка на гарантийное обслуживание № " + this.props.ticketNumber}>{this.props.contacts.email + ' '}</a>
                    Тел.: {this.props.contacts.telnum + ' '}
                    Внутр: {this.props.contacts.extum + ' '}
                </div>

                <hr />

                <div>
                    <label>Коментарий:</label>
                    <input type="text" id="comment" value={this.state.comment} onChange={this.handleUserInput}/>
                </div>
                <br /><br />

                <div>
                    <label>Сервисный центр: </label>
                    <select id="serviceCenter" onChange={this.changeServiceCenter} value={this.state.serviceCenter}>
                        <option value="" defaultValue>Выбрать сервисный центр</option>
                        {this.props.serviceCenterOptions.map(sc =>
                            <option key={sc._id} value={sc._id}>{sc.scTitle}</option>
                        )}
                    </select>
                    {this.state.serviceCenterDetails !== undefined ?
                        <div><b>Адрес СЦ: </b>{this.state.serviceCenterDetails.scAdress} <br /> <b>Авторизация
                            вендоров:</b> {this.state.serviceCenterDetails.scVendors}</div> : ''}
                </div>

                <div>
                    <label>Ремонт: </label>
                    <select id="typeOfService" onChange={this.handleUserInput} value={this.state.typeOfService}>
                        {this.typeOfServiceOptions.map(typeOfService =>
                            <option key={typeOfService.value} value={typeOfService.value}>{typeOfService.label}</option>
                        )}
                    </select>
                </div>

                <div>
                    <label>Требуемое время на проведение сервсных работ:</label>

                    <input id="finishDate"
                           onChange={this.handleUserInputDate}
                           value={this.state.daysForService}
                           placeholder="Введите количество дней (от даты заявки)"/>
                    <div>Дада завершения: {this.state.finishDate}</div>

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

                <button onClick={this.saveFormFunc}> SAVE</button>
                <button onClick={this.resetForm}>RESET</button>
                <button onClick={ () => {
                    this.props.deleteButtonClick(this.ticketNumber, this._id)

                } }>DELETE
                </button>
                <button onClick={()=>{console.log(this.state)}}> TEST </button>
                <hr />

            </form>
        )
    }
}
export {OpenFormComponent}

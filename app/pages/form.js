import React, {Component} from 'react';
import {Layout} from "../controls/layout";
import ReactPhoneInput from 'react-phone-input-2'

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
        place: 0,
        placeAnother: '',
        projectCode: '',
        ticketPriority: 0,

        newTicketNumber: '',
        datetimeOfCreate: '',

        telnumCheck: {},
        formErrors: {},
        formValid: false
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
            .then(()=>console.log('inserted'))
            .then(
                ()=>{
                    alert ('Создано обращение №' + this.state.newTicketNumber + '  ' + this.state.datetimeOfCreate)
                }
            );

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

    /*Заменить все функции
    * handleUserInput (e) {
     const name = e.target.name;
     const value = e.target.value;
     this.setState({[name]: value});
     }*/

    onChangeHandler = (event) => {

    };

    firstNameChange = (event) => {
       // console.log('firstNameChange', event.target.value);
        this.setState({firstname:event.target.value})
    };

    lastNameChange = (event) => {
        //console.log('lastNameChange', event.target.value);
        this.setState({lastname:event.target.value})
    };

    familyNameChange = (event) => {
       // console.log('familyNameChange', event.target.value);
        this.setState({familyname:event.target.value})
    };

    emailChange = (event) => {
        //console.log('emailChange', event.target.value);
        this.setState({email:event.target.value})
    };

    extnumChange = (event) => {
       // console.log('extnumChange', event.target.value);
        this.setState({extnum:event.target.value})
    };

    changePriority = (event) =>{
        //console.log('changePriority:', event.target.value);
        this.setState({ticketPriority: event.target.value})
    };

    placeChange = (event) => {
        this.setState({place: event.target.value});
        //console.log('this.state.place', this.state.place); // ПОЧЕМУ ТУТ ОСТАЕТСЯ СТАРОЕ ЗНАЧЕНИЕ, потому что обновление проихсодит внутри метода render() ???

        let errorsObj = this.state.formErrors;
        event.target.value == '5' ? errorsObj['placeAnother'] = 'error' : delete errorsObj['placeAnother'];
        this.setState({formErrors: errorsObj})

    };

    placeAnotherChange = (event) =>{
        //console.log('changeAnotherPlace:', event.target.value);
        this.setState({placeAnother: event.target.value})
    };

    vendorChange = (event) =>{
       // console.log('changeVendor:', event.target.value);
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
        //console.log('changepartProblem:', event.target.value);
        this.setState({problem: event.target.value})
    };

    projectCodechange = (event) =>{
        //console.log('changeProjectCodec:', event.target.value);
        this.setState({projectCode: event.target.value})
    };


    checkLetters = (target) => {
        let value = target;
        let pattern = /^[A-Za-zА-Яа-я]+$/;
       // console.log('checkLetters value: ', value,' resutl: ', pattern.test(value));
        return pattern.test(value)
    };

    checkEmail = (target) => {
        let value = target;
        let pattern = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
       //console.log('checkEmail', pattern.test(value));
        return pattern.test(value)
    };

    changeClassName = (target) => {
        this.state.formErrors.hasOwnProperty(target.id) ? target.className = "input_error" : target.className = "input_correct"
    };

    onBlur = (event) => {
        //   console.log('blur');
        let target = event.target;
        let targetId = event.target.id;
        let required = event.target.required;
        let validator = event.target.dataset.validator;
        let checkValue = this.state[targetId];

        console.log('validator: ',validator);

        //!required ? targetId = "notrequired" : '';
        let errorsObj = this.state.formErrors;

        !required && checkValue.length == 0 ? validator = 'notrequired': '';

        switch (validator) {

            case 'person' : {
                checkValue.length < 3 || !this.checkLetters(checkValue) ?
                    errorsObj[targetId] = 'error' :
                    delete errorsObj[targetId];
                this.changeClassName(target)
            }break;

            case 'email' : {
                !this.checkEmail(checkValue) ?
                    errorsObj[targetId] = 'error' :
                    delete errorsObj[targetId];
                this.changeClassName(target)
            }break;

            /*case 'telnum' : {

            }break;*/

            case 'standart' :{
              checkValue.length < 2 ? errorsObj[targetId] = 'error' : delete errorsObj[targetId];
                this.changeClassName(target)
            }break;

            case 'problem' :{
                checkValue.length < 7 ? errorsObj[targetId] = 'error' : delete errorsObj[targetId];
                this.changeClassName(target)
            }break;

            case 'placeAnother' :{
                checkValue.length < 7 ? errorsObj[targetId] = 'error' : delete errorsObj[targetId];
                this.changeClassName(target)
            }break;

            case 'notrequired' : {
                console.log('notrequired');
                target.className = '';
                delete this.state.formErrors[targetId]
            }break;



            default: {
                event.target.required ?
                    (this.state.formErrors.hasOwnProperty(targetId) ? event.target.className = 'input_error' : event.target.className = 'input_correct')
                    : '';
            }break;
        }
        this.setState({formErrors: errorsObj});
        //console.log('this.state.formErrors', this.state.formErrors)
        this.checkform();
        //  console.log('this.state.formErrors', this.state.formErrors);
      //  console.log('id:',event.target.id, 'required:', event.target.required, 'hasOwnProperty(validator)', this.state.formErrors.hasOwnProperty(validator), 'value.length:',event.target.value.length == 0);

    };

    onFocus = (event) => {
        event.target.className='';

    };

    onTelNumBlur = () => {

        let errorsObj = this.state.formErrors;

        this.state.telnum.length === 18 ? delete errorsObj['telnum'] : errorsObj['telnum']='error';
        //this.state.telnum.length !== 18 ? this.setState({telnumCheck:{borderColor: 'red'}}) : this.setState({telnumCheck:{}});
        console.log(this.state.formErrors.hasOwnProperty('telnum'));

        console.log('telNumBlur', this.state.telnum.length );

        this.setState({formErrors: errorsObj});

        this.state.formErrors.hasOwnProperty('telnum') ?
            this.setState({telnumCheck:{borderColor: 'red'}}) :
            this.setState({telnumCheck:{borderColor: 'green'}});
        this.checkform();

    };

    telnumChange = (event) => {
        console.log('telnumnChange:', event);
        this.setState({telnum:event})
    };

    checkform = () => {
        let arrayOfErrors = Object.keys(this.state.formErrors);
        let requireArrayCheck = true;
        let requireArray = [
            this.state.firstname,
            this.state.lastname,
            this.state.email,
            this.state.telnum,
            this.state.vendor,
            this.state.model,
            this.state.partNumber,
            this.state.problem
        ];
        //console.log('checkform --- test:', requireArray[0].length)

        for (let i=0; i<requireArray.length; i++){
            if (requireArray[i].length == 0){
                requireArrayCheck = false
            }
        }
        console.log('---- CHECKFORM:   arrayOfErrors',arrayOfErrors.length ==0,' requireArrayCheck ',requireArrayCheck, 'result:', (arrayOfErrors.length == 0 && requireArrayCheck));

        this.setState({formValid: (arrayOfErrors.length == 0 && requireArrayCheck)})

    };

    render(){

        return (
            <Layout>
                <h1>Form, {this.state.newTicketNumber !== '' ? <div>Создано обращение № {this.state.newTicketNumber + '  ' + this.state.datetimeOfCreate} МСК</div> : ''}</h1>
                <form id="CreateTicket" onSubmit={(event)=>{event.preventDefault()}}>
                    <hr />
                    <div><b>Инициатор:</b></div>

                    <div>
                    <label>* Имя</label>
                    <input id="firstname"
                           placeholder="Введите Имя"
                           onChange={this.firstNameChange}
                           onFocus={this.onFocus}
                           onBlur={this.onBlur}
                           value={this.state.firstname}
                           data-validator="person"
                           className=""
                           required />
                    { this.state.formErrors.hasOwnProperty('firstname') ? <span className="form__error">Поле "Имя" должно содержать Больще 2х символов</span> : ''}
                    </div>

                    <div>
                        <label>* Фамилия: </label>
                        <input id="lastname"
                            placeholder="Введите Фамилию"
                            onChange={this.lastNameChange}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            value={this.state.lastname}
                            data-validator="person"
                            className=""
                            required />
                    { this.state.formErrors.hasOwnProperty('lastname') ? <span className="form__error">Поле "Фамилия" должно содержать Больще 2х символов</span> : ''}
                    </div>

                    <div>
                        <label>  Отчество: </label>
                        <input id="familyname"
                           onChange={this.familyNameChange}
                           placeholder="Введите Отчество"
                           onFocus={this.onFocus}
                           onBlur={this.onBlur}
                           value={this.state.familyname}
                           data-validator="person"
                           className=""/>
                    { this.state.formErrors.hasOwnProperty('familyname') ? <span className="form__error">Поле "Отчество" должно содержать Больще 2х символов</span> : ''}
                    </div>

                    <div>
                        <label>* E-mail:</label>
                        <input id="email"
                            placeholder="Укажите E-mail в формате example@site.com"
                            onChange={this.emailChange}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            value={this.state.email}
                            type="email"
                               data-validator="email"
                               className=""
                            required/>
                    { this.state.formErrors.hasOwnProperty('email') ?  <span className="form__error">Это поле должно содержать E-Mail в формате example@site.com</span> : '' }
                    </div>

                    <div>
                    <label>* моб. телефон: </label>
                        <ReactPhoneInput id="telnum"
                                         onFocus={this.onFocus}
                                         onBlur={this.onTelNumBlur}
                                         defaultCountry={'ru'}
                                         onChange={this.telnumChange}
                                         value={this.state.telnum}
                                         inputStyle={this.state.telnumCheck}
                                         buttonStyle={this.state.telnumCheck}/>
                    { this.state.formErrors.hasOwnProperty('telnum') ? <span className="form__error">Номер телефона должен быть в формате +79876543210 </span> : '' }
                    </div>

                    <div>
                    <label>  внутр. №: </label>
                    <input id="extnum"
                        onChange={this.extnumChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        value={this.state.extnum}
                        data-validator="standart"
                    />
                    </div>

                    <hr />

                    <div>
                    <label>* Производитель / вендор: </label>
                    <input id="vendor"
                        onChange={this.vendorChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        value={this.state.vendor}
                        data-validator="standart"
                        placeholder="Укажите производителя: HP, Eaton, CISCO...."
                        required/>

                        { this.state.formErrors.hasOwnProperty('vendor') ?  <span className="form__error">Просьба указать производителя</span> : '' }

                    </div>

                    <div>
                    <label>* Модель: </label>
                    <input id="model"
                        className=""
                        onChange={this.modelChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        value={this.state.model}
                        data-validator="standart"
                        required />
                    { this.state.formErrors.hasOwnProperty('model') ?  <span className="form__error">Просьба указать модель / артикул</span> : '' }

                    </div>

                    <div>
                    <label>* P/N или Заводской номер: </label>
                    <input id="partNumber"
                        onChange={this.partNumberChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        value={this.state.partNumber}
                        data-validator="standart"
                        required />
                    { this.state.formErrors.hasOwnProperty('partNumber') ?  <span className="form__error">Просьба указать partnumber / хаводской номер</span> : '' }
                    </div>

                    <div>
                    <label>* Описание проблемы:</label>
                    <textarea id="problem"
                        onChange={this.problemChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        value={this.state.problem}
                        data-validator="problem"
                        required/>
                    { this.state.formErrors.hasOwnProperty('problem') ?  <span className="form__error">Просьба указать причину от 7-ми сиволов</span> : '' }
                    </div>

                    <div>
                    <label>  Код проекта: </label>
                    <input id="projectCode"
                        onChange={this.projectCodechange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        value={this.state.projectCode}
                        data-validator="standart"/>
                    { this.state.formErrors.hasOwnProperty('projectCode') ?  <span className="form__error">Просьба указать внутренний код проекта</span> : '' }
                    </div>

                    <div>
                    <label>* Местонахождение оборудования: </label><br />
                    <select id="place"
                            onChange={this.placeChange}
                            value={this.state.place}>
                        {this.placeOptions.map(place =>
                            <option key={place.value} value={place.value}>{place.label}</option>
                        )}
                    </select>{this.state.place === '5' ?
                    <input id="placeAnother"
                        placeholder="Укажите местоположение оборудование"
                        onChange={this.placeAnotherChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        value={this.state.placeAnother}
                        className="input_error"
                        data-validator="placeAnother"
                        /> : '' }
                    </div>

                    <div>
                    <label>Приоритет заявки: </label>
                    <select className="selectPriority" onChange={this.changePriority} value={this.state.ticketPriority}>
                        {this.ticketPriorityOptions.map(priority =>
                            <option key={priority.value} value={priority.value}>{priority.label}</option>
                        )}
                    </select>
                    </div>

                    <button onClick={this.saveData} className="btn btn-primary" disabled={!this.state.formValid}>Отправить</button>
                    <button onClick={()=>{
                        console.log(this.state.formErrors); console.log(this.state); console.log('formValid:', this.state.formValid)
                    }} className="btn btn-primary" >--- TEST</button>
                    <button onClick={()=>{
                        let test = document.getElementById('model');
                        test.className="input_error2"
                    }}>  --- TEST CSS --- </button>

                    <button onClick={()=>{this.telTestFunc()}}>  --- TEST TEL2 --- </button>
                </form>

            </Layout>
        )
    }
} // end of component

export {Form}

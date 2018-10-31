import React, {Component} from 'react';
import {Layout} from "../controls/layout";
import {landing} from './props'

class ServiceCenters extends Component{
    state = {
        sc: [],
        scTickets: [],
        openformForCreate: false,
        openformForEdit: '',
        idOfupdatedSC: '',
        newCs: '',
        deleteCs: '',
    };

    componentDidMount() {
        this.getAllServiceCenters();
    }

    getAllServiceCenters = () =>{
        fetch(`/mongooseGetDataSC`)
            .then(res => res.json())
            .then(json => this.setState({ sc: json }));

        fetch(`/mongooseGetTicketsSC`)
            .then(res => res.json())
            .then(json => this.setState({scTickets: json}))
            //.then(console.log(this.state.scTickets))
        /*.then(res => res.json())
            .then(json => this.setState({ scTelnum: json }))
            .then(console.log('this.state.scTelnum', this.state.scTelnum));*/
    };

    updateSericeCenter = (stateForUpdate) => {
        console.log(stateForUpdate);
        fetch('/mongooseSCUpdate', {
            method: 'post',
            body: JSON.stringify({
                ...stateForUpdate
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(checkStatus)
            //.then(()=>console.log('updated'))
            .then(() => this.getAllServiceCenters())
            .then(() => this.setState({idOfupdatedSC: stateForUpdate._id, openformForEdit: null}));

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

    insertServiceCenter = (saveData) => {
            console.log('insertServiceCenter', saveData);

            fetch('/mongooseSCInsert', {
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
                //.then(checkStatus => checkStatus.json())
                /*.then((json)=> this.setState({
                    newTicketNumber: json.resJson.ticketNumber,
                    datetimeOfCreate: json.resJson.currnetDateTime}))*/
                .then(()=>{this.getAllServiceCenters()})
                .then(()=>{this.setState({openformForCreate: false, newCs: true})})
                .then(()=>console.log('new sc inserted'));



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

    deleteServiceCenter = (id) => {
        console.log('deleteServiceCenter, id', id);

        fetch('/mongooseSCDelete', {
            method: 'post',
            body: JSON.stringify({ _id: id }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(checkStatus)
            //.then(checkStatus => checkStatus.json())
            /*.then((json)=> this.setState({
             newTicketNumber: json.resJson.ticketNumber,
             datetimeOfCreate: json.resJson.currnetDateTime}))*/
            .then(()=>{this.getAllServiceCenters()})
            .then(()=>{this.setState({openformForCreate: false, deleteCs: true})})
            .then(()=>console.log('sc deleted'));



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

    /*foo = () =>{
        console.log(this.state.sc);
        return 'open console:)))'
    };*/

    /*userChangeHandler = (event, type) => {
        let scArray = this.state.sc;
        console.log(' ---- userChangeHandler = ',event.target,'type', type , event.target.value, event.target.id, event.target.keyId);
        //state[event.target.id] = event.target.value;
        //this.setState({state: state})
        let serviceCenter = scArray.find(serviceCenter => serviceCenter._id === event.target.id);
        serviceCenter[type] = event.target.value;
        console.log(scArray);
        this.setState({sc: scArray});
    }; */

    checkServiceCenterInTickets = (scId) => {

        let tickets = this.state.scTickets.filter(tickets => tickets.sc === scId);

        return( tickets.map(assignedSC => assignedSC.ticketNumber) )
    };

    deleteHandler = (scId) =>{
        let checkSc = this.checkServiceCenterInTickets(scId);
      checkSc.length > 0 ? alert('Ошибка, СЦ назначен по заявк(е/ам): ' + checkSc) : this.deleteServiceCenter(scId)
    };


    render(){
        return (
            <Layout>
                <h1>Сервисные центры: </h1>
                {this.state.newCs ? <div>Новый сервис-центр добавлен! <p onClick={()=>{this.setState({newCs:false})}}><b>- Скрыть -</b></p></div> : ''}
                    <button onClick={()=>{this.setState({openformForCreate: true})}}>Добавить сервисный центр</button>
                    <button onClick={()=>{this.setState({openformForCreate: false})}}>Закрыть</button>

                        {this.state.openformForCreate && <ServiceCenterForm  clickSaveFunc = {this.insertServiceCenter}/> }

                <div>{this.state.sc.map(serviceCenter =>(
                        <div key={serviceCenter._id}>
                            {this.state.idOfupdatedSC === serviceCenter._id && <div> Данные обновлены! </div>}<b>Сервисный Центр: </b>{serviceCenter.scTitle}
                            <p><b>Обслуживает: </b>{serviceCenter.scVendors}</p>
                            <p><b>Адрес и контакты: </b>{serviceCenter.scAdress}</p>
                                <button onClick={()=>{this.setState({openformForEdit: serviceCenter._id})}}>Редакктировать СЦ</button>
                                <button onClick={()=>{this.setState({openformForEdit: ''})}}>Закрыть</button>


                            {this.state.openformForEdit === serviceCenter._id &&
                                    <ServiceCenterForm
                                        clickSaveFunc = {this.updateSericeCenter}
                                        clickDelFunc = {this.deleteHandler}
                                        {...serviceCenter}
                                    /> }


                            <hr />
                        </div>

                    ))}
                    <button onClick={()=>{
                        console.log(this.state);
                        console.log(this.checkServiceCenterInTickets('5bcea6360c898a5cbe269f9a'));

                    }}> ---- TEST </button>
                    <button onClick={()=>{this.deleteServiceCenter('5bd87131691704064098311b')}}> TEST DEL </button>

                </div>
            </Layout>

        )
    }
}


class ServiceCenterForm extends Component {
state = {
    scTitle: '',
    scAdress: '',
    scVendors: '',
    _id: '',
};


  componentDidMount(){
      this.getState()
    }

    getState = () => {
        this.setState({...this.props});
    };

    scChangeHandler = (event) => {
        let state = this.state;
        state[event.target.id] = event.target.value;
        this.setState({[event.target.id]:state[event.target.id]});

    };

    render(){
        return(

            <div>
            <hr />
            <h4>Form: add</h4>
            <label>Назавние СЦ!!: </label>
            <input id='scTitle'
               onChange={this.scChangeHandler} value={this.state.scTitle}
            />

            <label>Перечень обслуживаемых вендоров: </label>
            <input id="scVendors"
               onChange={this.scChangeHandler}
                   value={this.state.scVendors}
            />

            <label>Адрес и контактная информация</label>
            <input id="scAdress"
                   onChange={this.scChangeHandler}
                   value={this.state.scAdress}
            />

            <button onClick={ () => {this.props.clickSaveFunc(this.state)} }>Сохранить</button><button onClick={()=>{this.getState()}}>Сбросить</button>
            <button onClick={ () => {this.props.clickDelFunc(this.state._id)} }>Удалить СЦ</button>

                <button onClick={()=>{
                    console.log(this.state);
                }}> --- TEST STATE</button>


            <hr />
        </div>
        )
    }
}

export {ServiceCenters}




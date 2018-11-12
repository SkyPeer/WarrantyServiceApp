import React, {Component} from 'react';
import {Layout} from "../../controls/layout";
import {ServiceCenterForm} from "./form"

class ServiceCentres extends Component {
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

    getAllServiceCenters = () => {
        fetch(`/mongooseGetDataSC`)
            .then(res => res.json())
            .then(json => this.setState({sc: json}));
        fetch(`/mongooseGetTicketsSC`)
            .then(res => res.json())
            .then(json => this.setState({scTickets: json}))
    };

    updateSericeCenter = (stateForUpdate) => {
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
            .then(() => {
                this.getAllServiceCenters()
            })
            .then(() => {
                this.setState({openformForCreate: false, newCs: true})
            })
            .then(() => console.log('new sc inserted'));

        function checkStatus(responsee) {
            if (responsee.status >= 200 && responsee.status < 300) {
                return responsee
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        }
    };

    deleteServiceCenter = (id) => {
        fetch('/mongooseSCDelete', {
            method: 'post',
            body: JSON.stringify({_id: id}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(checkStatus)
            .then(() => {
                this.getAllServiceCenters()
            })
            .then(() => {
                this.setState({openformForCreate: false, deleteCs: true})
            })
            .then(() => console.log('sc deleted'));


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

    checkServiceCenterInTickets = (scId) => {

        let tickets = this.state.scTickets.filter(tickets => tickets.sc === scId);

        return ( tickets.map(assignedSC => assignedSC.ticketNumber) )
    };

    deleteHandler = (scId) => {
        let checkSc = this.checkServiceCenterInTickets(scId);
        checkSc.length > 0 ? alert('Ошибка, СЦ назначен по заявк(е/ам): ' + checkSc) : this.deleteServiceCenter(scId)
    };

    render() {
        return (
            <Layout>
                <header><div className="header_title">Сервисные центры</div></header>


                <div id="additionalMenu">
                        <button onClick={() => {this.state.openformForCreate ? this.setState({openformForCreate: false}) : this.setState({openformForCreate: true})}}>
                            {this.state.openformForCreate ? 'Свернуть' : 'Добавить сервисный центр '}
                        </button>
                </div>

                {this.state.newCs ? <div>Новый сервис-центр добавлен! <p onClick={() => {
                    this.setState({newCs: false})
                }}><b>- Скрыть -</b></p></div> : ''}

                <div className="content">
                {this.state.openformForCreate && <ServiceCenterForm clickSaveFunc={this.insertServiceCenter}/> }

                <div className="serviceCenterS">{this.state.sc.map(serviceCenter => (
                    <div className={this.state.openformForEdit !== serviceCenter._id ? 'serviceCenter': 'serviceCenter edit'}
                         key={serviceCenter._id}>
                        {this.state.idOfupdatedSC === serviceCenter._id && <div> Данные обновлены! </div>}
                        <div className="scMain">

                            <div className="scTitle"><b>Сервисный Центр: </b>{serviceCenter.scTitle}</div>
                            <div className="scVendors"><b>Обслуживает: </b>{serviceCenter.scVendors}</div>
                            <div className="scAdress"><b>Адрес и контакты: </b>{serviceCenter.scAdress}</div>

                                <button className="editScButton" onClick={() => {
                                    this.state.openformForEdit !== serviceCenter._id ? this.setState({openformForEdit: serviceCenter._id}) : this.setState({openformForEdit: null})}}>
                                    {this.state.openformForEdit !== serviceCenter._id ? 'Редактировать СЦ' : 'Закрыть'}
                                </button>
                        </div>

                        <div className="ServiceCenterFormOpen">
                            {this.state.openformForEdit === serviceCenter._id &&
                            <ServiceCenterForm
                                clickSaveFunc={this.updateSericeCenter}
                                clickDelFunc={this.deleteHandler}
                                deleteResetButtonsEnabled={true}
                                {...serviceCenter}
                            /> }
                        </div>

                    </div>
                ))}
                </div>
                </div>
            </Layout>
        )
    }
}

export {ServiceCentres}
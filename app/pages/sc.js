import React, {Component} from 'react';
import {Layout} from "../controls/layout";


class ServiceCenters extends Component{
    state = {
        sc: [],
        scTitle: '',
        scVendros: '',
        scAdress: '',
        openformForCreate: false,
        openformForEdit: ''
    };

    componentDidMount() {
        this.getAllServiceCenters();
    }

    getAllServiceCenters = () =>{
        fetch(`/mongooseGetDataSC`)
            .then(res => res.json())
            .then(json => this.setState({ sc: json }));
    };

    updateSericeCenter = (updateSc, id) => {
        fetch('/mongooseSCUpdate', {
            method: 'post',
            /*body: JSON.stringify({
             _id: id,
             status: updatearg.status
             }), */
            body: JSON.stringify({
                _id: id,
                ...updateSc

            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(checkStatus)
            //.then(()=>console.log('updated'))
            .then(() => this.getAllData())
            .then(() => this.setState({idOfupdatedTicket: id, openTicketDescId: null}));

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

    foo = () =>{
        console.log(this.state.sc);
        return 'open console:)))'
    };

    userChangeHandler = (event, type) => {
        let scArray = this.state.sc;
        console.log(' ---- userChangeHandler = ',event.target,'type', type /*event.target.value, event.target.id, event.target.keyId*/);
        /*state[event.target.id] = event.target.value;
        this.setState({state: state})*/
        let serviceCenter = scArray.find(serviceCenter => serviceCenter._id === event.target.id);
        serviceCenter[type] = event.target.value;
        console.log(scArray);
        this.setState({sc: scArray});


    };


    render(){
        return (
            <Layout>
                <h1>Сервисные центры:</h1>
                    <button onClick={()=>{this.setState({openformForCreate: true})}}>Добавить сервисный центр</button>
                    <button onClick={()=>{this.setState({openformForCreate: false})}}>Закрыть</button>

                        {this.state.openformForCreate && <ServiceCenterForm/> }

                <div>{this.state.sc.map(serviceCenter =>(
                        <div key={serviceCenter._id}>
                            <p><b>Сервисный Центр: </b>{serviceCenter.scTitle}</p>
                            <p><b>Обслуживает: </b>{serviceCenter.scVendors}</p>
                            <p><b>Адрес и контакты: </b>{serviceCenter.scAdress}</p>
                                <button onClick={()=>{this.setState({openformForEdit: serviceCenter._id})}}>Редакктировать СЦ</button>
                                <button onClick={()=>{this.setState({openformForEdit: ''})}}>Закрыть</button>
                                <button>Удалить СЦ</button>

                            {this.state.openformForEdit === serviceCenter._id &&
                                    <ServiceCenterForm
                                        userChangeHandler = {this.userChangeHandler}
                                        scTitle = {serviceCenter.scTitle}
                                        scVendors = {serviceCenter.scVendors}
                                        scAdress = {serviceCenter.scAdress}
                                        id={serviceCenter._id}
                                        //value = {this.state.sctitle}
                                    /> }


                            <hr />
                        </div>

                    ))}
                    <button onClick={()=>{console.log(this.state)}}> ---- TEST </button></div>
            </Layout>

        )
    }
}


class ServiceCenterForm extends Component {
/*state = {
    scTitle: '',
    scAdress: '',
    scVendors: ''
};

  componentDidMount(){
        this.setState({
            scTitle: this.props.scTitle,
            scAdress: this.props.scAdress,
            scVendors: this.props.scVendors,
            id: this.props.id
        });
        console.log(this.props);
        //console.log(this.state);

    }*/

    render(){
        return(

            <div>
            <hr />
            <h4>Form: add</h4>
            <label>Назавние СЦ!!: </label>
            <input id={this.props.id}
                //placeholder={this.props.scTitle}
                onChange={(event)=>{this.props.userChangeHandler(event, 'scTitle')}}
                value={this.props.scTitle}
            />

            <label>Перечень обслуживаемых вендоров: </label>
            <input id="scVendors"
                onChange={(event)=>{this.props.userChangeHandler(event)}}
                value={this.props.scVendors}
            />

            <label>Адрес и контактная информация</label>
            <input id="scAdress"
                onChange={(event)=>{this.props.userChangeHandler(event)}}
                value={this.props.scAdress}
            />

            <button onClick={()=>{console.log(this.state)}}>Сохранить</button><button>Сбросить</button>
            <hr />
        </div>
        )
    }
}




export {ServiceCenters}




import React, {Component} from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { render } from 'react-dom'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import {Main} from "./pages/main";
import {Search} from "./pages/search";
import {Form} from "./pages/form";
import {Layout} from "./controls/layout";

class TicketsComponent extends Component{
    state = {
        data: [],
        openTicketDescId: null,
        idOfupdatedTicket: null
    };


    getAllData () {
        fetch(`/mongooseGetData`)
            .then(res => res.json())
            .then(json => this.setState({data: json}))
    }

    updateDataFunc = (updatearg, id) => {
        console.log('clickFunc', updatearg, id);

            fetch('/mongooseUpdate', {
                method: 'post',
                /*body: JSON.stringify({
                    _id: id,
                    status: updatearg.status
                }), */
                body: JSON.stringify({
                    _id: id,
                    comment: updatearg.comment,
                    /*status: updatearg.status,
                    place: updatearg.place,
                    finishDate: updatearg.finishDate,
                    serviceCentre: updatearg.serviceCentre,
                    serviceCenterTicket: updatearg.serviceCentreTicket,
                    typeOfservice: updatearg.typeOfservice */
                    //...updatearg

                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(checkStatus)
                .then(()=>console.log('updated'))
                .then(()=>this.getAllData());
                /*.then(()=>this.setState({idOfupdatedTicket: id})); */

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


    componentDidMount() {
        this.getAllData();
    }

    statusOptions = [
        { value: 0, label: 'Новая' },
        { value: 1, label: 'Необходимы уточнения' },
        { value: 2, label: 'В работе' },
        { value: 3, label: 'Завершена' },
        { value: 4, label: 'Отклонена' },
    ];


    render(){
        return(
            <Layout>
                    {this.state.data.map((ticket) => (
                            <div key={ticket._id}>
                            <div>
                                <div>{this.state.idOfupdatedTicket === ticket._id ? <div>ОБНОВЛЕНА!!!</div> : ''}
                                Заявка {ticket.ticketNumber} от {ticket.ticketDate} приоритет: {ticket.ticketPriority} Статус: {this.statusOptions[ticket.status].label}</div>
                                <div>Инициатор {ticket.firstname +' '+ ticket.lasname + ' '+ ticket.familyname}</div>
                                <Link to={'/list/'+ticket._id}>Подробнее об оборудовании {ticket.vendor} {ticket.model}</Link>

                                    <div>

                                        {ticket._id === this.state.openTicketDescId && (
                                            <section>

                                                <OpenDescComponent
                                                    idshnik={ticket._id}
                                                    problem={ticket.problem}

                                                    contacts={

                                                        {
                                                            telnum: ticket.telnum,
                                                            email: ticket.email,
                                                            extum: ticket.extnum
                                                        }
                                                    }
                                                    projectCode={ticket.projectCode}
                                                    place={ticket.place}
                                                    status={ticket.status}
                                                    statusOptions={this.statusOptions}
                                                    finishDate={ticket.finishDate}
                                                    serviceCentre={ticket.serviceCentre}
                                                    typeOfservice={ticket.typeOfService}
                                                    comment={ticket.comment}
                                                    saveButtonClick={(arg)=>{this.updateDataFunc(arg, ticket._id)}}

                                                />
                                            </section>)
                                        }
                                        <button onClick={()=>{this.setState({openTicketDescId:ticket._id})}}>OPEN</button>
                                        <button onClick={()=>{this.setState({openTicketDescId:null})}}>CLOSE</button>
                                    </div>
                                    <hr />
                                </div>
                            </div>))}
            </Layout>
        )}
}// end of RouterComponent

class OpenDescComponent extends  Component {

    state = {
        comment: '',
        status: '',
    };

    statusOptions = this.props.statusOptions;



    fullSetStateFunc = () => {
        console.log(' --- fullSetStateFunc');
        this.setState({
            comment: this.props.comment,
            status: this.props.status
        })
    };

    componentDidMount(){
      /*  this.setState({
            comment: this.props.comment,
            status: this.props.status
        }) */

        this.setState({
            comment: this.props.comment,
            //status: this.props.status
        });

      console.log('--componentDidMount');
      this.fullSetStateFunc()

    }


    resetForm = () => {
       this.fullSetStateFunc();
    };


    onChangeInputFunc = (event) => {
        console.log(event.target.value);
        this.setState({comment: event.target.value});
    };

    /*changeStatus = (event) => {
    console.log(event.value)}; */


    changeStatus(event){
        console.log(event.value);
     this.setState({status: event.value})
    }

    /*changeStatus = (event) => {
        console.log(event.value);
        this.setState({status: event.value})
    };*/


    clickFormFunc = () =>
    {
        this.props.saveButtonClick({
            comment: this.state.comment,
            //status: this.state.status
        });
        //this.componentDidMount();
    };

    render(){
        return(
            <form id="OpenDescComponent" onSubmit={(event)=>{event.preventDefault()}}>
                <div>Key: {this.props.idshnik} </div>
                <div>Причина: {this.props.problem}</div><br />
            <div>Код проекта: {this.props.projectCode}</div><div>Местонахождение оборудования: {this.props.place}</div><br />
            <div>Контакты:</div>
            <div>Email: <a href={"mailto:" + this.props.contacts.email}>{this.props.contacts.email +' '}</a>
                 Тел.: {this.props.contacts.telnum +' '}
                 Внутр: {this.props.contacts.extum +' '}
            </div>
            <hr />
            <div>Коментарий:<input type="text" id="comment" value={this.state.comment} onChange={this.onChangeInputFunc} /><br />

                Сервисный центр: <input defaultValue={this.props.serviceCentre} /><br />

                Ремонт: <input defaultValue={this.props.typeOfservice}/><br />

                Дата завершения ремонта <input defaultValue={this.props.finishDate}/><br />

                <label>Статус заявки:</label><Dropdown id="status" options={this.statusOptions} onChange={this.changeStatus.bind(this)} value={this.statusOptions[this.state.status]} placeholder="Select an option" />

                <button onClick={this.clickFormFunc}> SAVE </button>
                <button onClick={()=>{this.resetForm()}}>Reset</button>


                <hr />
        </div>
        </form>
        )
    }
}

class DescComponent extends Component{
    state =
        {
            data:{}
        };
    arg = this.props.match.params.ticketid;
    foo = console.log('DescComponent, this.arg: ',this.arg);

    componentDidMount() {

        fetch('/mongoosefind', {
            method: 'post',
            body: JSON.stringify({_id: this.arg}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => this.setState({data: json}))
    };


    render(){
        return(
            <Layout>
                <h5>Title: {this.state.data.ticketNumber}</h5>
                <h5>Desc: {this.state.data.problem}</h5>
                <Link to={'../list'}>Обратно к заявкам</Link>
            </Layout>);
    }

} //NewDeafultComponent

const Routing = () => (
    <Switch>
        <Route exact path='/' component={Main}/>
        <Route path='/list/:ticketid' component={DescComponent}/>
        <Route path='/list' component={TicketsComponent}/>
        <Route path='/search' component={Search}/>
        <Route path='/form' component={Form}/>
    </Switch>
);


//const Api = () => (<TicketsComponent />,);

render(
    <BrowserRouter>
        <Routing />
    </BrowserRouter>,
    document.getElementById('root'));

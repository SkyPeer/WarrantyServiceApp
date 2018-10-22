import React, {Component} from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { render } from 'react-dom'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

class TicketsComponent extends Component{
    state = {
        data: [],
        openTicketDescId: null
    };


    getAllData () {
        fetch(`/mongooseGetData`)
            .then(res => res.json())
            .then(json => this.setState({data: json}))
    }

    clickFunc = (arg) => {
        console.log('clickFunc', arg)
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
            <div>
                <ul>
                    {
                        this.state.data.map((ticket) => (
                            <li key={ticket._id}>
                            <div>
                                <div>Заявка {ticket.ticketNumber} от {ticket.ticketDate} приоритет: {ticket.ticketPriority} Статус: {this.statusOptions[ticket.status].label}</div>
                                <div>Инициатор {ticket.firstname +' '+ ticket.lasname + ' '+ ticket.familyname}</div>
                                <Link to={`${ticket._id}`}>Подробнее об оборудовании {ticket.vendor} {ticket.model}</Link>

                                    <div>

                                        {ticket._id === this.state.openTicketDescId && (
                                            <section>

                                                <OpenDescComponent
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
                                                    saveButtonClick={(arg)=>{this.clickFunc(arg)}}

                                                />
                                            </section>)
                                        }
                                        <button onClick={()=>{this.setState({openTicketDescId:ticket._id})}}>OPEN</button>
                                        <button onClick={()=>{this.setState({openTicketDescId:null})}}>CLOSE</button>
                                    </div>
                                    <hr />
                                </div>
                            </li>))}
                </ul>
            </div>
        )}
}// end of RouterComponent

class OpenDescComponent extends  Component {
    /*constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }*/

/*    onChangeInputValue = (event) =>{
        console.log('onChangeInputValue', event);
        //this.setState({comment : this.event.target.value});
    }; */

    state = {
        commentValue: '',
        status: '',
    };

    statusOptions = this.props.statusOptions;

    fullSetStateFunc = () => {
        this.setState({
            commentValue: this.props.comment,
            status: this.props.status
        })
    };

    componentDidMount(){
        this.setState({
            commentValue: this.props.comment,
            status: this.props.status
        })

        /*this.setState({
            commentValue: this.props.comment,
            status: this.props.status
        })*/
    }

    testFunc1(){
        let a = 2;
        let b = 2;
        return a + b;
    };

    testFunc2 = () => {
        let a = 2;
        let b = 2;
      return a + b;
    };



    resetForm = () => {
       this.fullSetStateFunc();
    };



    onChangeInputFunc = (event) => {
        console.log(event.target.value);
        this.setState({commentValue: event.target.value});
    };

    /*changeStatus = (event) => {
    console.log(event.value)}; */

    changeStatus = (event) => {
        console.log(event.value)
        this.setState({status: event.value})
    };


    clickFormFunc = () =>
    {
        this.props.saveButtonClick(this.state.commentValue);
        return 'ok';
    };

    render(){
        return(
            <form id="OpenDescComponent" onSubmit={(event)=>{event.preventDefault()}}>
            <div>Причина: {this.props.problem}</div><br />
            Код проекта: {this.props.projectCode} <br />
            <div>Контакты:</div>

            <div>Email: <a href={"mailto:" + this.props.contacts.email}>{this.props.contacts.email +' '}</a>
                 Тел.: {this.props.contacts.telnum +' '}
                 Внутр: {this.props.contacts.extum +' '}
            </div>
            <hr />
            <div>Коментарий:<input type="text" id="comment" value={this.state.commentValue} onChange={this.onChangeInputFunc} /><br />

                Сервисный центр: <input defaultValue={this.props.serviceCentre} /><br />

                Ремонт платный/не платный <input defaultValue={this.props.typeOfservice}/><br />

                Дата завершения ремонта <input defaultValue={this.props.finishDate}/><br />

                <label>Статус заявки:</label><Dropdown id="status" options={this.statusOptions} onChange={this.changeStatus} value={this.statusOptions[this.state.status]} placeholder="Select an option" />

                <button onClick={this.clickFormFunc}> SAVE </button>
                <button onClick={()=>{this.resetForm()}}>Reset</button>
                <button onClick={()=>{
                    console.log('f1 = ', this.testFunc1);
                    console.log('f2 = ', this.testFunc2)
                }}>Reset</button>

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
            <div>
                <h5>Title: {this.state.data.ticketNumber}</h5>
                <h5>Desc: {this.state.data.problem}</h5>
                <Link to={'/'}>Обратно к заявкам</Link>
            </div>);
    }

} //NewDeafultComponent


const Routing = () => (
    <Switch>
        <Route exact path='/' component={TicketsComponent}/>
        <Route path='/:ticketid' component={DescComponent}/>
    </Switch>
);


const Api = () => (
    <TicketsComponent />,
        <Routing />
);

render(
    <BrowserRouter>
        <Api/>
    </BrowserRouter>,
    document.getElementById('root'));

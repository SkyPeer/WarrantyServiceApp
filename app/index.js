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

    render(){
        return(
            <div>
                <ul>
                    {
                        this.state.data.map((ticket) => (
                            <li key={ticket._id}>
                            <div>
                                <div>Заявка {ticket.ticketNumber} от {ticket.ticketDate} приоритет: {ticket.ticketPriority} Статус: {ticket.status}</div>
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
                                                    finishDate={ticket.finishDate}
                                                    serviceCentre={ticket.serviceCentre}
                                                    typeOfservice={ticket.typeOfService}
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
        commentValue: '33211',
        selectValue: 'select'
    };

    options = [
    { value: 0, label: 'Zero' },
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' } ];

    defaultOption = this.options[1];

    onChangeInputFunc = (event) => {
        console.log(event.target.value);
        this.setState({commentValue: event.target.value});
    };
/*
    onChangeInputFunc = (event) => {
        console.log(event.target.value);
        this.setState({comment : event.target.value});
    };
*/
    resetForm = () => {
        this.setState({commentValue: '33211'});
    };

    change = function(event){
    console.log(event.value)};

    clickFormFunc = () =>
    {
        this.props.saveButtonClick(this.state.commentValue);
        return 'ok';
    };

    render(){
        return(
            <form id="OpenDescComponent" onSubmit={(event)=>{event.preventDefault()}} className="OpenDescComponent">
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
                Статус:<input defaultValue={this.props.status}/><br />
                <button onClick={this.clickFormFunc}> SAVE </button>
                <button onClick={()=>{this.resetForm()}}>Reset</button>
                <Dropdown options={this.options} onChange={this.change} value={this.defaultOption} placeholder="Select an option" />
                <hr />
                <div>
                    <select id="lang" onChange={this.change} value={this.state.selectValue}>
                        <option value="select">Select</option>
                        <option value="Java">Java</option>
                        <option value="C++">C++</option>
                    </select>
                    <p></p>
                    <p>{this.state.selectValue}</p>
                </div>


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

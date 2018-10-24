import React, {Component} from 'react';
import {Layout} from "../controls/layout";

class Form extends Component{
    state =  {
        firstname: '',
        lasname: '',
        familyname: '',
        email: '',
        telnum: '',
        extnum: '',
        type: '',
        vendor: '',
        model: '',
        partNumber: '',
        problem: '',
        place: '',
        projectCode: '',
        ticketPriority: ''
    };


    render(){
        return (
            <Layout>
                <h1>Form</h1>
                <form>
                    <div>Инициатор:</div>
                    <label>Имя</label><input onChange={this.firstNameChange}/>
                    <label>Фамилия</label><input onChange={this.firstNameChange}/>
                    <label>Отчество</label><input onChange={this.firstNameChange}/>
                    <label>Имя</label><input onChange={this.firstNameChange}/>
                    <label>Имя</label><input onChange={this.firstNameChange}/>


                </form>

            </Layout>
        )
    }
}
export {Form}

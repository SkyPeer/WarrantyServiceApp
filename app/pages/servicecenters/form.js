import React, {Component} from 'react';

class ServiceCenterForm extends Component {
    state = {
        scTitle: '',
        scAdress: '',
        scVendors: '',
        _id: '',
    };


    componentDidMount() {
        this.getState()
    }

    getState = () => {
        this.setState({...this.props});
    };

    scChangeHandler = (e) => {
        let state = this.state;
        state[e.target.id] = e.target.value;
        this.setState({[e.target.id]: state[e.target.id]});

    };

    render() {
        return (

            <div className="scForm">
                <label>Назавние СЦ: </label>
                <input id='scTitle'
                       onChange={this.scChangeHandler}
                       value={this.state.scTitle}
                       placeholder="Веедие название СЦ"
                />

                <label>Перечень обслуживаемых вендоров: </label>
                <input id="scVendors"
                       onChange={this.scChangeHandler}
                       value={this.state.scVendors}
                       placeholder="Перечислите имеющуюся авторизацию у вендоров"
                />

                <label>Адрес и контактная информация: </label>
                <input id="scAdress"
                       onChange={this.scChangeHandler}
                       value={this.state.scAdress}
                       placeholder="Уточние контактную информаци, Адрес, телефон, сайт, почту, контактное лицо"
                />

                <button className="openDescForm_form_button save" onClick={ () => {
                    this.props.clickSaveFunc(this.state)
                } }>Сохранить
                </button>
                <button className="openDescForm_form_button reset" style={this.props.deleteResetButtonsEnabled ? {display: ''}: {display:'none'}} onClick={() => {
                    this.getState()
                }}>Сбросить
                </button>
                <button className="openDescForm_form_button delete" style={this.props.deleteResetButtonsEnabled ? {display: ''}: {display:'none'}} onClick={ () => {
                    this.props.clickDelFunc(this.state._id)
                } }>Удалить СЦ
                </button>
            </div>
        )
    }
}

export {ServiceCenterForm}
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

                <button onClick={ () => {
                    this.props.clickSaveFunc(this.state)
                } }>Сохранить
                </button>
                <button onClick={() => {
                    this.getState()
                }}>Сбросить
                </button>
                <button onClick={ () => {
                    this.props.clickDelFunc(this.state._id)
                } }>Удалить СЦ
                </button>

                <hr />
            </div>
        )
    }
}

export {ServiceCenterForm}
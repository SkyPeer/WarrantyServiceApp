/*fetch(`/mongooseGetDataTickets`)
        .then(res => res.json())
        .then(json => this.setState({data: json.data, currentDate: json.currentDate}));
    fetch(`/mongooseGetDataSC`)
        .then(res => res.json())
        .then(json => this.setState({sc: json}))*/

import {changeDataInStoreAction} from "./actions";

export function getDataProvider() {
    console.log('mongooseGetDataTickets provider');
    return (dispatch) => {
        fetch('/mongooseGetDataTickets')
            .then((response) => {return response})
            .then((response) => response.json())
            .then((providerData) => dispatch(changeDataInStoreAction(providerData, 'tickets')));
        /*fetch(`/mongooseGetDataSC`)
            .then((response) => {return response})
            .then((response) => response.json())
            .then((serviceCenters) => this.setState({sc: json}))*/
    };
}
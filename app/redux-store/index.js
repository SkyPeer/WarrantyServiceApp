import {createStore} from 'redux';

function reduxState(
    state = {
        data: [],
        sc: [],
        counter: 0,
    }, action) {

    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        //return state - 1;
        case 'GETDATA':
            fetch(`/mongooseGetDataTickets`)
                .then(res => res.json())
                .then(json => this.state({data: json.data, currentDate: json.currentDate}));
            fetch(`/mongooseGetDataSC`)
                .then(res => res.json())
                .then(json => this.state({sc: json}));
        default:
            return state
    }
}

setInterval(() => {
    console.log('redux interval');
    store.dispatch({type: 'INCREMENT'});
}, 4000);


let store = createStore(reduxState)

//store.subscribe(() => console.log('store.subscribe(() - store.getState()', store.getState()))

//store.dispatch({ type: 'INCREMENT' });

store.dispatch({type: 'INCREMENT'});

store.dispatch({type: 'DECREMENT'});

export default store
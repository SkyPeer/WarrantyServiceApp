import {createStore} from 'redux';

function reduxState(
    state = {
        data: [],
        sc: [],
        currentDate : '',
        counter: 1,

    }, action) {

    switch (action.type) {
        case 'INCREMENT':
        {
            state.counter  = state.counter + 1;
            return state
        }

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
    store.dispatch({type: 'INCREMENT'});
}, 4000);


let store = createStore(reduxState);

//store.subscribe( () => console.log( 'store.subscribe(() - store.getState()', store.getState() ) );

//store.dispatch({ type: 'INCREMENT' });

store.dispatch({type: 'INCREMENT'});

//store.dispatch({type: 'DECREMENT'});

export default store
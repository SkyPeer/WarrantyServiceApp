import {createStore} from 'redux';
import axios from 'axios';

function reduxState(
    state = {
       data: [],
        sc: [],
        currentDate : '',


    }, action) {

    switch (action.type) {
        case 'INCREMENT':
        {
            state.counter  = state.counter + 1;
            return state
        }

        case 'GETDATA':
            fetch(`/mongooseGetDataTickets`)
                .then(res => res.json())
                .then(json => {state.data = json.data; state.currentDate = json.currentDate});
            fetch(`/mongooseGetDataSC`)
                .then(res => res.json())
                .then(json => state.sc = json);
            /*(async function getData() {
                let data = await axios.get('/mongooseGetDataTickets');
                state.data = data.data
                console.log(state.data)
            })();*/

        case 'DISPATCHDATA':
        {
            console.log('action.foo', action.foo)
            //console.log(arguments)
            //state.data = data;
        }


        case 'GETSC':
            /*fetch(`/mongooseGetDataSC`)
                .then(res => res.json())
                .then(json => state.sc = json);*/

        default:
            return state
    }
}

/*setInterval(() => {
    store.dispatch({type: 'GETDATA'});
}, 4000);*/

/*let userProvider = {
    async fetch() {
        let response = await axios.post('/mongooseGetDataTickets');
        return response.data.users;
    },
};*/



let store = createStore(reduxState);

//store.subscribe( () => console.log( 'store.subscribe(() - store.getState()', store.getState() ) );

//store.dispatch({ type: 'INCREMENT' });

//store.dispatch({type: 'INCREMENT', arg:1});

//store.dispatch({type: 'GETDATA'});
//store.dispatch({type: 'DECREMENT'});

export default store
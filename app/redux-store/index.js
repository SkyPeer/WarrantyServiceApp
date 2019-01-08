import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    data: [],
    sc: [],
    currentDate: '',
};


function reducer(state = initialState, action) {
    switch(action.type) {
        case 'CHANGESTORE':

            console.log('CHANGESTORE REDUCE');
            console.log('action.items', action.providerData)
            state.data = action.providerData.data;
            state.currentDate = action.providerData.currentDate;

            return {
                data: state.data,
                currentDate: state.currentDate
                //total: state.total
            };
        default:
            return state;
    }
}



function reduxState(state = {
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
                .then(json => {state.data = json.data; state.currentDate = json.currentDate})
                .then(console.log('GETDATA mongooseGetDataTickets'));

            fetch(`/mongooseGetDataSC`)
                .then(res => res.json())
                .then(json => state.sc = json)
                .then(console.log('GETDATA mongooseGetDataSC'));

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



let store = createStore(reducer, applyMiddleware(thunk));

//store.subscribe( () => console.log( 'store.subscribe(() - store.getState()', store.getState() ) );

//store.dispatch({ type: 'INCREMENT' });

//store.dispatch({type: 'INCREMENT', arg:1});

//store.dispatch({type: 'GETDATA'});
//store.dispatch({type: 'DECREMENT'});

store.subscribe(() => console.log('STORE updated'/*, store.getState()*/));

export default store
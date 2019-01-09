import {getDataProvider} from "./providers";

export function changeDataInStoreAction(providerData, dataType) {
    console.log(' --- changeDataInStoreAction' + ' dataType:', dataType);
    return {
        type: 'CHANGESTORE', providerData: providerData
    };
}

export function getDataAction() {
    console.log('getDataAction');
    /*return (dispatch) => {
        fetch('http://5826ed963900d612000138bd.mockapi.io/items')
            .then((response) => {return response})
            .then((response) => response.json())
            .then((items) => dispatch(changeDataInStoreAction(items)))
    };*/
    return getDataProvider()
}
import { ToastAndroid, Alert } from 'react-native'
import { Utils } from '../export';

export async function getAllCategory() {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=0tltuka9fo2s30oqs0h63fldu3lbvv0o");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://jaja.id/backend/master/category", requestOptions)
        .then(response => response.text())
        .then(resp => {
            try {
                let result = JSON.parse(resp)
                if (result.status.code === 200 || result.status.code === 204) {
                    return result.data;
                } else {
                    Alert.alert(
                        "Jaja.id",
                        String(result.status.message) + " => " + String(result.status.code),
                        [
                            {
                                text: "TUTUP",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                        ]
                    );
                    return null
                }
            } catch (error) {
                console.log("🚀 ~ file: Category.js ~ line 36 ~ getAllCategory ~ error", error)
                Utils.handleError(JSON.stringify(resp), "Error with status code : 41021")
                return null
            }
        })
        .catch(error => {
            Utils.handleError(error, "Error with status code : 41022")
            return null

        });
}


export async function getCategroys(text, dispatch) {
    dispatch({ type: 'SET_SEARCH_LOADING', payload: true })
    dispatch({ type: 'SET_CATEGORY_NAME', payload: String(text) })
    dispatch({ type: 'SET_KEYWORD', payload: String(text).toLocaleLowerCase() })

    let error = true
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=akeeif474rkhuhqgj7ah24ksdljm0248");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`https://jaja.id/backend/product/category/${text}?page=1&limit=100&keyword=&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions)
        .then(response => response.json())
        .then(result => {
            error = false
            dispatch({ type: 'SET_SEARCH_LOADING', payload: false })
            dispatch({ type: 'SET_SEARCH', payload: result.data.items })
            dispatch({ type: 'SET_FILTERS', payload: result.data.filters })
            dispatch({ type: 'SET_SORTS', payload: result.data.sorts })
        })
        .catch(error => {
            error = false
            dispatch({ type: 'SET_SEARCH_LOADING', payload: false })
            Utils.alertPopUp(String(error), 'Error with status code : 14001')
        });

    setTimeout(() => {
        if (error) {
            Utils.handleSignal()
            dispatch({ type: 'SET_SEARCH_LOADING', payload: false })
        }
    }, 15000);

}
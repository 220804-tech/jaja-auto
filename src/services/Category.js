import axios from 'axios';
import { ToastAndroid, Alert } from 'react-native';
import { Utils } from '../export';

const API_URL = 'https://jaja.id/backend';

export async function getAllCategory() {
    const requestOptions = {
        method: 'get',
        headers: {
            Cookie: "ci_session=0tltuka9fo2s30oqs0h63fldu3lbvv0o"
        }
    };

    try {
        const response = await axios(`https://jaja.id/backend/master/category`, requestOptions);
        const data = response.data;

        if (data.status.code === 200 || data.status.code === 204) {
            return data.data;
        } else {
            Utils.handleErrorResponse(data, "Error with status code : 41021");
            return null;
        }
    } catch (error) {
        Utils.handleError(error, "Error with status code : 41022");
        return null;
    }
}

export async function getCategroys(text, dispatch) {
    dispatch({ type: 'SET_SEARCH_LOADING', payload: true });
    dispatch({ type: 'SET_CATEGORY_NAME', payload: String(text) });
    dispatch({ type: 'SET_KEYWORD', payload: String(text).toLocaleLowerCase() });

    const requestOptions = {
        method: 'get',
        headers: {
            Cookie: "ci_session=akeeif474rkhuhqgj7ah24ksdljm0248"
        }
    };

    try {
        const response = await axios(`${API_URL}/product/category/${text}?page=1&limit=100&keyword=&filter_price=&filter_location=&filter_condition=&filter_preorder=&filter_brand=&sort=`, requestOptions);
        const data = response.data;

        dispatch({ type: 'SET_SEARCH_LOADING', payload: false });
        dispatch({ type: 'SET_SEARCH', payload: data.data.items });
        dispatch({ type: 'SET_FILTERS', payload: data.data.filters });
        dispatch({ type: 'SET_SORTS', payload: data.data.sorts });
    } catch (error) {
        dispatch({ type: 'SET_SEARCH_LOADING', payload: false });
        Utils.handleError(error, "Error with status code : 14001");
    }
}

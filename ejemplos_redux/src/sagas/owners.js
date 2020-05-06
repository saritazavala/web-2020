import {
    call,
    takeEvery,
    put,
    select
 } from 'redux-saga/effects';

import * as selectors from '../reducers';
import * as types from  '../types/petOwners';
import * as actions from '../actions/petOwners';
const API_BASE_URL = 'http://localhost:8000/api/v1/owner';

function* fetchOwners(action){
    const isAuthenticated = yield select(selectors.isAuthenticated);

    if (isAuthenticated){
        const token = yield select(selectors.getAuthToken);
        console.log(token);
        /***/

        const hola = yield call(
            fetch,
            `${API_BASE_URL}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`

                }
            }
        );
        const entities = { } 
        const order = []
        const response = hola.json();
        console.log(response);
        yield put(actions.completeFetchingPetOwners(entities,order));
    }


}

export function* watchFetchOwners(){
    yield takeEvery(types.PET_OWNERS_FETCH_STARTED, fetchOwners);
}





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
function* addOwner(action) {
    const { oldId, petOwner } = action.payload
    try {
       
        const isAuthenticated = yield select(selectors.isAuthenticated);
        if (isAuthenticated) {
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
                fetch,
                `${API_BASE_URL}`,
                    {
                    method: 'POST',
                    body: JSON.stringify({ name: petOwner }),
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );
            if (response.status < 400) {
                const { id, name } = yield response.json();
                yield put(actions.completeAddingPetOwner(oldId, { id, name }));
            } else {
                yield put(actions.failAddingPetOwner(oldId, "Fallo horrible la conexin mano"));
            }
        } else {
            yield put(actions.failAddingPetOwner(oldId, "You are not logged in"));
        }
    } catch (e) {
        yield put(actions.failAddingPetOwner(oldId, e.message));
    }
}

function* removeOwner(action) {  
    const { id } = action.payload 
    try {
        const isAuthenticated = yield select(selectors.isAuthenticated);
        if (isAuthenticated) {
        
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
                fetch,
                `${API_BASE_URL}${id}`,
                    {
                    method: 'DELETE',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );
            if (response.status < 400) {
                yield put(actions.completeRemovingPetOwner());
            } else {
                yield put(actions.failRemovingPetOwner(id, "Fallo horrible la conexion mano"));
            }
        } else {
            yield put(actions.failRemovingPetOwner(id, "You are not logged int"));
        }
    } catch (e) {
        console.log(e)
        yield put(actions.failRemovingPetOwner(id, e.message));
    }
}

export function* watchAddOwner() {
    yield takeEvery(
        types.PET_OWNER_ADD_STARTED,
        addOwner,
    );
} 

export function* watchRemoveOwner() {
    yield takeEvery(
        types.PET_OWNER_REMOVE_STARTED,
        removeOwner,
    );
}

export function* watchFetchOwners(){
    yield takeEvery(types.PET_OWNERS_FETCH_STARTED, fetchOwners);
}





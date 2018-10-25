import { all, takeEvery } from 'redux-saga/effects';
import requestAction, { REQUEST } from './action'
import { requestSaga } from './saga'

function* rootSaga() {
	yield all([
		takeEvery(REQUEST, requestSaga)
	]);
}

const requestMiddleware = rootSaga();
requestMiddleware.withExtraArgument = rootSaga;

export const request = requestAction;
export const saga = requestSaga
export default requestMiddleware;

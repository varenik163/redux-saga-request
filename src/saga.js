import { all, takeEvery, put, call, select } from 'redux-saga/effects';
const START = '_START', SUCCESS = '_SUCCESS', ERROR = '_ERROR';
import regeneratorRuntime from 'regenerator-runtime'
//const apiDomenSelector = state => state.Auth.API;

export function* requestSaga(action) {
	const { payload, method, url, auth, oldType: type, token, token_is_active } = action;
	//const API = yield select(apiDomenSelector);

	if(auth && !token_is_active) return;

	try {
		yield put({
			...action,
			type: type + START
		});

		const body = payload ? JSON.stringify(payload) : '';
		const headers = new Headers({
			'Content-Type': 'application/json'
		});
		if (auth) headers.set('Authorization', "Bearer " + token);

		const params = {
			method,
			headers,
			mode: 'cors'
		};

		if (body && method !== 'GET') params.body = body;

		const data = yield call(
			fetch,
			//API +
			url,
			params
		);

		const response = yield data.json();

		if (data.status !== 200 || (data.status === 200 && response.status === 100)) {
			const error = getError(data, response);

			yield put({
				...action,
				type: type + ERROR,
				error
			})
		} else {
			yield put({
				...action,
				type: type + SUCCESS,
				response: {
					data: response.response,
					error: response.status === 100 || response.messages[0].type === 2
						? response.messages[0].message
						: null,
					status: response.status,
					message: response.status === 0 || response.messages[0].type === 0
						? response.messages[0].message
						: null
				}
			});
		}
	} catch (err) {
		console.log(err)
	}
}

export const getError = (data, response) => {
	if (data.status === 0) return {
		message: 'Unknow error: check your authorization. ' +
		'No \'Access-Control-Allow-Origin\' header is present on the requested resource.'
	};
	if (data.status === 500) return response;
	if (response.messages) return response.messages[0];

	return ''
};

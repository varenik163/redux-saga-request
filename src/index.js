function createRequestMiddleware(extraArgument) {
	return store => next => action => {
		const {auth} = action;

		if (!auth || action.token_is_active) return next(action);

		const auth_token = store.getState().Auth.idToken;

		if(!auth_token) {
			console.log('auth-token redirects');
			loginRedirect();
			return next(action);
		}

		try {
			fetch(API + `/v1/common/auth/check-token/${auth_token}`, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'}
			}).then(data => data.json()).then(data => {
				if(data.response.active) {
					next({
						...action,
						token: auth_token,
						token_is_active: true
					})
				}
				else {
					console.log('auth-token gives a shit');
					store.dispatch({type: authActions.LOGOUT + SUCCESS});
				}
			}).catch(err => {
				console.error(err);
			});
		}
		catch (err) {
			console.error(err)
		}

	}

}

const request = createRequestMiddleware();
request.withExtraArgument = createRequestMiddleware;

export default request;
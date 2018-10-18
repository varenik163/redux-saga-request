'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var REQUEST = 'REQUEST';
var request = function request(params) {
  return _extends({}, params, { oldType: params.type, type: REQUEST });
};

function createRequestMiddleware(extraArgument) {
	return function (store) {
		return function (next) {
			return function (action) {
				var auth = action.auth;


				if (!auth || action.token_is_active) return next(action);

				var auth_token = store.getState().Auth.idToken;
				var checkTokenPath = store.getState().Auth.checkTokenPath;

				if (!auth_token) {
					console.log('auth-token redirects');
					loginRedirect();
					return next(action);
				}

				try {
					fetch(API + ('' + checkTokenPath + auth_token), {
						method: 'GET',
						headers: { 'Content-Type': 'application/json' }
					}).then(function (data) {
						return data.json();
					}).then(function (data) {
						if (data.response.active) {
							next(_extends({}, action, {
								token: auth_token,
								token_is_active: true
							}));
						} else {
							console.log('auth-token gives a shit');
							store.dispatch({ type: authActions.LOGOUT + SUCCESS });
						}
					}).catch(function (err) {
						console.error(err);
					});
				} catch (err) {
					console.error(err);
				}
			};
		};
	};
}

var requestMiddleware = createRequestMiddleware();
requestMiddleware.withExtraArgument = createRequestMiddleware;

var request$1 = request;

exports.request = request$1;
exports.default = requestMiddleware;

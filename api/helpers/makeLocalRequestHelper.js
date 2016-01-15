'use strict';

const Request = require('./../services/requestService');

module.exports = function (actions, port, token) {
	if (!actions || !Array.isArray(actions) || !port ) {
		return;
	}

	let promises = [];

	actions.forEach(action => {
		const url = `http://localhost:${port}${action.path}`;

		switch(action.method){
		case 'PUT':
			promises.push(Request.addToken(token).put(url, action.body));
			break;
		case 'POST':
			promises.push(Request.addToken(token).post(url, action.body));
			break;
		case 'DELETE':
			promises.push(Request.addToken(token).delete(url));
			break;
		default:
		case 'GET':
			promises.push(Request.addToken(token).get(url));
			break;
		}
	});

	return Promise.all(promises);
}
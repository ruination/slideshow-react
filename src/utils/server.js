import fetch from 'axios';
import * as URL from '../utils/url';
import * as Device from '../utils/device';
import * as Session from '../utils/session';
import { requestUser, receiveUser } from '../actions/user';

const 
	isScreeners = ((process.env.TARGET === 'screeners') ||	(typeof application !== 'undefined' && application.env.context == 'screeners')),
	http =  isScreeners
		? 'http' 
		: 'https',
	apiurl = isScreeners
		? process.env.URL_SCREENERS
		: process.env.URL
;

let loginRetryAttempt = undefined;

export const request = function (url, options = {}, retry = {count: 0}) {
	let {data = {}, redirect = 'error', ...opt} = options;

	if (this && this.dispatch) {
		retry.dispatch = this.dispatch
		retry.state = this.state
	}
        	
	data = 
	{
		'session_id': Session.get('session_id'),
		...data,
	};

	let encodedUrl = url

	if (opt.method && opt.method.match(/post/i)) {
		opt.headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		opt.data = URL.encode(data)
	}
	else
		encodedUrl = url + "?" + URL.encode(data);

	opt.redirect = redirect;
	opt.url = `${http}://${apiurl}/api/v2/${encodedUrl}`;
	opt.validateStatus = status => status <= 400;

	const fetchUrl = function(resolve, reject) {
		return fetch(opt)
			.then(
			    (response) =>  {
			    	if (response.status > 200) {
			    		const device_secret = Device.getSecret();

				    	if (response.data && response.data.code && response.data.code != 'error.session_expired') {
				    		reject(response.data || {}) 
				    	}
				    	else if (!device_secret) {
	             			if (retry.count > 0)
	                        	reject(response.data)
	                        else
	                        	request(url, options, {...retry, count: retry.count+1, reject, resolve})
				    	}
				    	else  {
				    		const loginOptions = {
				    			url: `${http}://${apiurl}/api/v2/device/signin`,
					        	method: 'POST', 
					        	data: URL.encode({
									device_id: Device.getID(),
									device_secret,
					        	}),       
					        	validateStatus: status => status <= 400,
	        					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					    	}	

	                    	if (loginRetryAttempt === undefined)
	                    		loginRetryAttempt = fetch(loginOptions)

							if (retry.dispatch)
								retry.dispatch(requestUser(retry.state));

					    	loginRetryAttempt = loginRetryAttempt.then(
	                         	(loginResponse) => {
	             					loginRetryAttempt = undefined;
						
									if (!loginResponse.data || !loginResponse.data.code || loginResponse.data.code == 'error.session_expired' || !loginResponse.data.context)
	                 					reject(response.data)
	                 				else
										Device.set(loginResponse.data.context.device.device_id, loginResponse.data.context.device.device_secret)

									if (retry.dispatch)
										retry.dispatch(receiveUser(loginResponse.data, retry.state));

		                        	if (retry.count > 0)
			                        	resolve(response.data)
			                        else
	                         			request(url, options, {...retry, count: retry.count+1, reject, resolve})

	                         		return loginResponse
	                         	}, 
	                         	(loginResponse) => {
	                 				loginRetryAttempt = undefined;

		                        	if (retry.count > 0)
			                        	reject(response.data)
			                        else
		                         		request(url, options, {...retry, count: retry.count+1, reject, resolve})

	                         		return loginResponse
	                         	}
	                        )

	                     	return loginRetryAttempt
	                    }			    		
			    	}
			    	else
			    		return resolve(response.data)
			    }, 

			    (response) => reject(response)
		    )
	}

	if (retry.reject && retry.resolve)
		return fetchUrl(retry.resolve, retry.reject)
	else
		return new Promise(fetchUrl)
}

export default function(dispatch, state) {
	const Server = function() {
		this.dispatch = dispatch
		this.state = state
		this.request = request.bind(this)
	}

	return new Server();
}
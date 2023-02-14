import { checkNetworkStatus } from './utils';
const NetworkState = () => {
	let _isOnline = true;
	let totalCalls = 0;
	const obj = {
		get isOnline() {
			return _isOnline;
		},
		onChange: undefined,
	};

	const onChangeHandler = (_e, checkPreviousState = true) =>
		checkNetworkStatus((status, data) => {
			if (checkPreviousState) {
				if (status != _isOnline) {
					_isOnline = status;
					if (typeof obj.onChange === 'function')
						obj.onChange.call(
							undefined,
							status,
							++totalCalls,
							data
						);
				}
			} else {
				_isOnline = status;
				if (typeof obj.onChange === 'function')
					obj.onChange.call(undefined, status, ++totalCalls, data);
			}
		});

	onChangeHandler(undefined, false);
	window.navigator.connection.onchange = onChangeHandler;

	return obj;
};

export default NetworkState;

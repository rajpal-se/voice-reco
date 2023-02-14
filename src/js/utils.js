module.exports.element = (id) => {
	if (id) {
		const ele = document.getElementById(id);
		return ele;
	}
};

module.exports.checkNetworkStatus = async (callback) => {
	let status = 0;
	let data = undefined;
	await fetch('https://jsonplaceholder.typicode.com/todos/1', {})
		.then((data) => {
			status = data.status;
			return data.json();
		})
		.then((_data) => {
			data = _data;
		})
		.catch(() => {});
	if (typeof callback === 'function') {
		callback.call(undefined, status >= 200 && status < 400, data);
	}
};

module.exports.createElement = (
	elementType,
	props = {},
	children = undefined
) => {
	if (elementType && typeof props === 'object') {
		const ele = document.createElement(elementType);

		Object.keys(props).map((key) => {
			ele[key] = props[key];
		});
		if (children) {
			if (Array.isArray(children)) {
				children.forEach((child) => {
					ele.appendChild(child);
				});
			} else {
				ele.append(children);
			}
		}
		return ele;
	}
};

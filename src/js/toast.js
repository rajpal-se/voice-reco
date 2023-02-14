import { createElement } from './utils';

const Toast = () => {
	const obj = {};

	// Setup dom
	const toastCon = createElement('div', { id: 'toastCon' });
	document.body.appendChild(toastCon);

	const messageDef = (data, type = 'Default', duration = 2000) => {
		if (Number.isInteger(type)) {
			duration = type;
			type = 'Default';
		}
		if (!/^[a-zA-Z]+$/.test(type)) {
			type = 'Default';
		}

		let isClosed = false;

		const messageWrapperNode = createElement('div', {
			className: 'toastWrapper',
		});
		const messageNode = createElement('div', {
			className: `toast ${type.toLowerCase()}`,
		});
		const closeBtn = createElement('span', { className: 'close' });
		messageWrapperNode.appendChild(messageNode);
		messageNode.append(data);
		messageNode.appendChild(closeBtn);
		toastCon.appendChild(messageWrapperNode);
		messageWrapperNode.classList.add('animationAdd');

		const closeHandler = () => {
			if (!isClosed) {
				isClosed = true;
				messageWrapperNode.classList.add('animationRemove');
				setTimeout(() => {
					messageWrapperNode.remove();
				}, 1000);
			}
		};
		closeBtn.addEventListener('click', closeHandler);

		if (duration > 0) {
			setTimeout(() => {
				closeHandler();
			}, duration);
		}

		return {
			elements: {
				messageWrapperNode,
				messageNode,
				closeBtn,
			},
			close: closeHandler,
		};
	};

	Object.defineProperty(obj, 'message', {
		value: messageDef,
		writable: false,
		enumerable: true,
	});
	return obj;
};

/* 
const toast = new Toast();

toast.message(`Hi, How are you? I am good , OK! Hey you are`);

setTimeout(() => {
	toast.message(`hJHG  KK hkjj hkj hkjh jh kjhkk hjh k kj `);
}, 4000);


toast.message(`Hi, How are you? I am good , OK! Hey you are`, 'default', 30000);
toast.message(`Hi, How are you? I am good , OK! Hey you are`, 'danger', 20000);
toast.message(`Hi, How are you? I am good , OK! Hey you are`, 'success', 10000);
toast.message(`Hi, How are you? I am good , OK! Hey you are`, 'defau-lt', 5000);
 */

export default Toast;

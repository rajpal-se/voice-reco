import './style.scss';
import SpeechRecognitionApp from './js/speechRecognitionApp';
import NetworkState from './js/networkState';
import Toast from './js/toast';
import OutputApi from './js/outputApi';
import { element, createElement } from './js/utils';
import { availableLanguages } from './js/constants';

// All elements referenced
// const mainCon = element('mainCon');
const selectLang = element('selectLang');
const startBtn = element('startBtn');
const resetBtn = element('resetBtn');
const helpBtn = element('helpBtn');

// const messsCon = element('messsCon');
// const toastCon = element('toastCon');
const guideCon = element('guideCon');
const guideCloseBtn = element('guideCloseBtn');

const srApp = new SpeechRecognitionApp();
const ns = new NetworkState();
const toast = new Toast();
const outputApi = new OutputApi();
outputApi.toast = toast;

/* Display Guide page only once */
const isGuideDone = window.localStorage.getItem('isGuideDone')?.toLowerCase() === 'true' ? true : false;
isGuideDone && guideCon.classList.toggle('show');

let connectionLostToast = null;

(() => {
	/* Set options in select element */
	availableLanguages.forEach((lang) => {
		const option = createElement('option');
		option.value = lang[0];
		option.innerText = lang[1];
		if (lang[0] === srApp.selectedLanguageCode) option.selected = true;
		selectLang.appendChild(option);
	});
})();

/* Setup Check Network state [online/offline] */
ns.onChange = (isOnline, totalCalls) => {
	if (totalCalls > 1) {
		if (isOnline) {
			if (connectionLostToast) {
				connectionLostToast.close();
				connectionLostToast = null;
			}
			toast.message(`You are connected.`, 'success', 5000);
		} else {
			connectionLostToast = toast.message(`Connection lost.`, 'danger', 0);
		}
	} else {
		if (!isOnline) {
			connectionLostToast = toast.message(`Internet is required.`, 'danger', 0);
		}
	}
};

/* Bind DOM events/functionality */

HTMLElement.prototype.on = function (event, callback) {
	this.addEventListener(event, callback);
};

guideCloseBtn.on('click', () => {
	guideCon.classList.toggle('show');
	window.localStorage.setItem('isGuideDone', true.toString());
});

helpBtn.on('click', () => {
	guideCon.classList.toggle('show');
});

startBtn.on('click', () => {
	if (startBtn.innerText.toLowerCase() === 'start') {
		srApp.start();
		startBtn.innerText = 'Stop';
		toast.message(`Listening started.`, 1000);
	} else {
		srApp.stop();
		startBtn.innerText = 'Start';
		toast.message(`Listening stopped.`, 1000);
	}
});

resetBtn.on('click', () => {
	if (startBtn.innerText.toLowerCase() !== 'start') {
		srApp.stop();
		startBtn.innerText = 'Start';
	}
	outputApi.addNewLine();
	// outputApi.selectedLineListenedEleRef.innerText = 'new line';

	Array.from(outputApi.outputCon.querySelectorAll('p.line:not(.selected)')).map((line) => line.remove());
	window.localStorage.removeItem('voice-reco-data');
});

selectLang.on('change', (e) => {
	srApp.setLanguage(e.target.value);
	const lang = availableLanguages.find((item) => item[0]?.toLowerCase() === e.target.value?.toLowerCase())?.[1];
	toast.message(`Language switched to ${lang}`, 2000);
});

// console.log(outputApi);

/* Speech functionality - on change */
srApp.onResult = (speechText) => {
	outputApi.onResult(speechText, srApp);
	outputApi.saveToLocalStorage();
};

document.body.on('keydown', (e) => {
	if (e.code.toLowerCase() === 'controlleft') {
		srApp.restart();
	}
});

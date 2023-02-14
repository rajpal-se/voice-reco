import { availableLanguages } from './constants';

/* Events flow

START  =>  AUDIO START  => SOUND START  =>  SPEECH START
    then,
Case 1:
    RESULT, RESULT, ....
        then,
    SPEECH END  =>  SOUND END  =>  AUDIO END  =>  RESULT (1 to n times)  =>  END

Case 2:
    AUDIO END  =>  ERROR  =>  END
*/

const SpeechRecognitionApp = () => {
	const obj = {
		availableLanguages,
		selectedLanguageCode: 'en-US', // Default language
		speechText: {
			previousSentence: '',
			newWords: '',
			newSentence: '',
		},
		isListening: false,
		onResult: () => {}, // callback: (speechText: {....}) => {}
	};

	const defaultConfig = {
		interimResults: true,
		continuous: false,
		maxAlternatives: 1,
	};

	obj.setLanguage = (languageCode, callback) => {
		if (
			obj.availableLanguages.find(
				(items) => items[0].toLowerCase() === languageCode.toLowerCase()
			)
		) {
			// Script to after language change

			// Assign new language code
			obj.selectedLanguageCode = languageCode;
			obj.restart();

			// Call callback function
			if (typeof callback === 'function') {
				callback.call(5);
			}
		}
	};

	obj.start = () => {
		obj.isListening = true;
		obj.speechRecognition.lang = obj.selectedLanguageCode;
		try {
			obj.speechRecognition.start();
		} catch (_e) {}
	};
	obj.stop = () => {
		obj.isListening = false;
		obj.speechRecognition.stop();
	};
	obj.restart = () => {
		obj.stop();
		setTimeout(() => {
			try {
				obj.start();
			} catch (_e) {}
		}, 500);
	};

	// Initialize SpeechRecognition
	(() => {
		let speechRecognitionApis = [
			'SpeechRecognition',
			'webkitSpeechRecognition',
			'mozSpeechRecognition',
			'msSpeechRecognition',
			'oSpeechRecognition',
		]; // speech recognition object

		const speechRecognitionApi = speechRecognitionApis.find(
			(api) => api in window
		);

		if (speechRecognitionApi) {
			obj.speechRecognition = new window[speechRecognitionApi]();
			Object.entries(defaultConfig).forEach((item) => {
				obj.speechRecognition[item[0]] = item[1];
			});

			obj.speechRecognition.onresult = (event) => {
				const text = event.results[0][0].transcript;
				// console.log('zzza', event.results[0][0]);
				const previousSentence = obj.speechText.newSentence;
				const newWords = text.slice(previousSentence.length).trim();
				const newSentence = text.trim();
				obj.speechText = {
					previousSentence,
					newWords,
					newSentence,
				};
				// const color = event.results[0][0].transcript;
				// diagnostic.textContent = `Result received: ${color}.`;
				// bg.style.backgroundColor = color;
				if (typeof obj.onResult === 'function')
					obj.onResult.call(obj, obj.speechText);
			};

			obj.speechRecognition.onend = () => {
				obj.speechText = {
					previousSentence: '',
					newWords: '',
					newSentence: '',
				};
				if (typeof obj.onResult === 'function')
					obj.onResult.call(obj, obj.speechText);
				if (obj.isListening) {
					obj.speechRecognition.start();
				}
			};
			/*
			obj.speechRecognition.onaudioend = (event) => {
				console.log('zzzs AUDIO END');
			};
			obj.speechRecognition.onaudiostart = (event) => {
				console.log('zzzs AUDIO START');
			};
			obj.speechRecognition.onend = (event) => {
				console.log('zzzs END');
			};
			obj.speechRecognition.onerror = (event) => {
				console.log('zzzs ERROR');
			};
			obj.speechRecognition.onnomatch = (event) => {
				console.log('zzzs NO MATCH');
			};
			obj.speechRecognition.onresult = (event) => {
				console.log('zzzs RESULT');
			};
			obj.speechRecognition.onsoundend = (event) => {
				console.log('zzzs SOUND END');
			};
			obj.speechRecognition.onsoundstart = (event) => {
				console.log('zzzs SOUND START');
			};
			obj.speechRecognition.onspeechend = (event) => {
				console.log('zzzs SPEECH END');
			};
			obj.speechRecognition.onspeechstart = (event) => {
				console.log('zzzs SPEECH START');
			};
			obj.speechRecognition.onstart = (event) => {
				console.log('zzzs START');
			};
			*/
		} else {
			throw new Error('SpeechRecognition api not found.');
		}
	})();

	return obj;
};

export default SpeechRecognitionApp;

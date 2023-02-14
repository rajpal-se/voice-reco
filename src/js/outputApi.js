import { element, createElement } from './utils';

const OutputApi = () => {
	const obj = {
		selectedLineRef: null,
		selectedLineListenedEleRef: null,
		newTextEleRef: {},
		outputCon: element('outputCon'),
		commands: {}, // Format {"command-name": () => { // callback }}
	};

	obj.selectLine = (lineRef) => {
		obj.selectedLineRef = lineRef;
		obj.selectedLineListenedEleRef = lineRef.querySelector('.listened');
		obj.selectedLineListenedEleRef?.after(obj.newTextEleRef.wrapper);
		[...obj.outputCon.querySelectorAll('p.line.selected')].forEach((line) =>
			line.classList.remove('selected')
		);
		lineRef.classList.add('selected');

		window.getSelection().selectAllChildren(obj.selectedLineRef);
		window.getSelection().collapseToEnd();
	};

	obj.selectSelectedLine = () => {
		// debugger;
		const allSelectedLines =
			obj.outputCon.querySelectorAll('p.line.selected');
		if (allSelectedLines.length) {
			obj.selectLine(allSelectedLines[allSelectedLines.length - 1]);
		} else {
			const allLines = obj.outputCon.querySelectorAll('p.line');
			if (allLines.length) {
				obj.selectLine(allLines[allLines.length - 1]);
			}
		}
	};

	obj.addNewLine = () => {
		const newLineEle = createElement('p', {
			className: 'line',
		});
		const newLineListenedEle = createElement('span', {
			className: 'listened',
		});
		newLineEle.append(newLineListenedEle);

		try {
			obj.selectedLineRef.after(newLineEle);
		} catch (e) {
			if (
				e.message.toLowerCase() ===
				`Cannot read properties of null (reading 'after')`.toLowerCase()
			) {
				obj.outputCon.append(newLineEle);
			}
			// console.log(e.message);
		}
		obj.selectLine(newLineEle);
	};

	obj.saveToLocalStorage = () => {
		const innerHTML = obj.outputCon.innerHTML;

		// console.log('call');
		// console.log(innerHTML);
		const lines = innerHTML
			.replace(/<p id="newTextEleRef".*?<\/p>/g, '')
			.replace(/<\/p>.*?<p/g, '</p>\n<p');
		window.localStorage.setItem('voice-reco-data', lines);
	};

	{
		// Initialize

		{
			obj.newTextEleRef.wrapper = createElement('p', {
				id: 'newTextEleRef',
				className: '',
			});
			obj.newTextEleRef.space1 = createElement('span', {
				className: 'space',
			});
			obj.newTextEleRef.space1.innerText = ' ';
			obj.newTextEleRef.space2 = createElement('span', {
				className: 'space',
			});
			obj.newTextEleRef.space2.innerText = ' ';
			obj.newTextEleRef.previousSentence = createElement('span', {
				className: 'previousSentence',
			});
			obj.newTextEleRef.newWords = createElement('span', {
				className: 'newWords',
			});
			obj.newTextEleRef.newSentence = createElement('span', {
				className: 'newSentence',
			});
			// obj.newTextEleRef.lineBreak = createElement('br');
			obj.newTextEleRef.wrapper.append(
				obj.newTextEleRef.space1,
				obj.newTextEleRef.previousSentence,
				obj.newTextEleRef.space2,
				obj.newTextEleRef.newWords
			);
		}

		{
			const config = { childList: true };
			const callback = (mutationList, observer) => {
				// console.log(mutationList, observer);
				for (const mutation of mutationList) {
					if (mutation.type === 'childList') {
						const allSelectedLines =
							obj.outputCon.querySelectorAll('p.line.selected');
						if (allSelectedLines.length > 1) {
							[...allSelectedLines].forEach((line) =>
								line.classList.remove('selected')
							);
							let lineToBeSelected = null;
							const selection = window.getSelection();
							if (
								selection.anchorNode.nodeName.toLowerCase() ===
								'#text'
							) {
								lineToBeSelected =
									selection.anchorNode.parentElement.closest(
										'p.line'
									);
							} else {
								lineToBeSelected =
									selection.anchorNode.closest('p.line');
							}
							if (lineToBeSelected) {
								obj.selectLine(lineToBeSelected);
							}
						}
						obj.saveToLocalStorage();
					}
				}
			};
			const observer = new MutationObserver(callback);
			observer.observe(obj.outputCon, config);
		}

		{
			const voiceRecoData =
				window.localStorage.getItem('voice-reco-data');
			if (voiceRecoData) {
				obj.outputCon.innerHTML = voiceRecoData;
			} else {
				obj.addNewLine();
			}
			obj.selectSelectedLine();

			obj.outputCon.addEventListener('click', (e) => {
				const clickedLine = e.target.closest('p.line');
				if (clickedLine) {
					obj.selectLine(clickedLine);
					window
						.getSelection()
						.selectAllChildren(obj.selectedLineRef);
					window.getSelection().collapseToEnd();
				}
			});
			document.addEventListener('keydown', (e) => {
				if (e.code.toLowerCase() === 'enter') {
					let preventDefault = false;
					const selection = window.getSelection();
					if (
						selection.anchorNode.nodeName.toLowerCase() === '#text'
					) {
						if (
							!selection.anchorNode.parentElement.classList.contains(
								'listened'
							)
						) {
							preventDefault = true;
						}
					} else if (
						selection.anchorNode.nodeName.toLowerCase() === 'span'
					) {
						if (
							!selection.anchorNode.parentElement.classList.contains(
								'line'
							)
						) {
							preventDefault = true;
						}
					} else {
						preventDefault = true;
					}
					if (preventDefault) {
						e.preventDefault();
						obj.addNewLine();
					}
					// console.log(e);
					// console.log(a);
					// console.log(a.anchorNode.closest('p#newTextEleRef'));
				}
			});
		}
	}

	const lastSpeech = {
		previousSentence: '',
		newWords: '',
		newSentence: '',
	};

	const onResultDef = (speechText, speechRecognitionApp = null) => {
		// console.log('zzz lastSpeech', lastSpeech);
		// console.log('zzz speechText', speechText);
		// console.log('zzz -----------------');
		if (
			speechText.previousSentence !== lastSpeech.previousSentence ||
			speechText.newWords !== lastSpeech.newWords ||
			speechText.newSentence !== lastSpeech.newSentence
		) {
			obj.newTextEleRef.previousSentence.innerText =
				speechText.previousSentence;
			obj.newTextEleRef.newWords.innerText = speechText.newWords;
			obj.newTextEleRef.newSentence.innerText = speechText.newSentence;

			const newText = speechText.newSentence.toLowerCase();
			const isCommand = Object.keys(obj.commands).includes(newText);

			// console.log('zzz', isCommand);

			isCommand && speechRecognitionApp && speechRecognitionApp.restart();

			if (
				!speechText.previousSentence &&
				!speechText.newWords &&
				!speechText.newSentence
			) {
				const lastNewText = lastSpeech.newSentence.toLowerCase();
				const isCommand = Object.keys(obj.commands).includes(
					lastNewText
				);
				// 	debugger;
				// 	console.log('zzz comand', isCommand);
				if (isCommand) {
					if (typeof obj.commands?.[lastNewText] === 'function') {
						obj.commands?.[lastNewText].call(
							undefined,
							lastNewText
						);
						speechRecognitionApp && speechRecognitionApp.restart();
					}
				} else {
					if (lastSpeech.newSentence) {
						const listenedEleRef =
							obj.selectedLineRef.querySelector('.listened');
						if (listenedEleRef?.innerText) {
							if (listenedEleRef.innerText.slice(-2) === '. ') {
								listenedEleRef.innerHTML +=
									lastSpeech.newSentence;
							} else if (
								listenedEleRef.innerText.slice(-1) === '.'
							) {
								listenedEleRef.innerHTML += ' ';
								listenedEleRef.innerHTML +=
									lastSpeech.newSentence
										.charAt(0)
										.toUpperCase() +
									lastSpeech.newSentence.slice(1);
							} else {
								{
									listenedEleRef.innerHTML += ' ';
									listenedEleRef.innerHTML +=
										lastSpeech.newSentence;
								}
							}
						} else {
							listenedEleRef.innerHTML +=
								lastSpeech.newSentence.charAt(0).toUpperCase() +
								lastSpeech.newSentence.slice(1);
						}
					}
				}
			}

			window.getSelection().selectAllChildren(obj.selectedLineRef);
			window.getSelection().collapseToEnd();

			lastSpeech.previousSentence = speechText.previousSentence;
			lastSpeech.newWords = speechText.newWords;
			lastSpeech.newSentence = speechText.newSentence;
		}
	};

	Object.defineProperty(obj, 'onResult', {
		value: onResultDef,
		writable: false,
		enumerable: true,
	});

	obj.commands['next line'] = (_command) => {
		const innerText = obj.selectedLineListenedEleRef.innerText;
		const lastChar = innerText.slice(-1);
		if (lastChar !== '.') {
			obj.selectedLineListenedEleRef.innerHTML += '.';
		}
		obj.addNewLine();
	};
	obj.commands['cut cut'] = (_command) => {
		obj.selectedLineListenedEleRef.innerHTML =
			obj.selectedLineListenedEleRef.innerText
				.trim()
				.replace(/\W?\w+\W?$/, '');
	};
	obj.commands['full stop'] = (_command) => {
		obj.selectedLineListenedEleRef.innerHTML += '. ';
	};
	obj.commands['copy text'] = (_command) => {
		const allLines = obj.outputCon.querySelectorAll('p.line');
		const texts = [...allLines].map((line) => {
			const text = line.innerText.trim();
			return (
				text.charAt(0).toUpperCase() +
				text.slice(1).replace(/\.+$/, '.')
			);
		});
		if (document.hasFocus()) {
			try {
				window.navigator.clipboard
					.writeText(texts.join('\n'))
					.then(() => {
						obj.toast.message('Text copied', 'success', 3000);
					});
			} catch (_e) {}
		} else {
			obj.toast.message('Focus the webpage first.', 'danger', 5000);
		}
	};

	obj.commands['copy html'] = (_command) => {
		const allLines = obj.outputCon.querySelectorAll('p.line span.listened');
		const pTags = [...allLines].map((line) => {
			const pTag = createElement('p');
			pTag.innerHTML = line.innerHTML;
			return pTag;
		});
		const container = createElement('div');
		container.append(...pTags);
		if (document.hasFocus()) {
			try {
				window.navigator.clipboard
					.writeText([container.innerHTML])
					.then(() => {
						obj.toast.message(
							'HTML copied successfully!',
							'success',
							3000
						);
					});
			} catch (_e) {}
		} else {
			obj.toast.message('Focus the webpage first.', 'danger', 5000);
		}
	};

	return obj;
};

export default OutputApi;

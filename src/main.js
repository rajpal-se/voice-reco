import './style.scss';

const App = () => {
	const lang = (() => {
		return [
			['ar', 'Arabic'],
			['bn', 'Bengali (Bangla)'],
			['bh', 'Bihari'],
			['zh', 'Chinese'],
			['zh-Hans', 'Chinese (Simplified)'],
			['zh-Hant', 'Chinese (Traditional)'],
			['cs', 'Czech'],
			['nl', 'Dutch'],
			['en-US', 'English (US)'],
			['en-UK', 'English (UK)'],
			['fr', 'French'],
			['el', 'Greek'],
			['gu', 'Gujarati'],
			['hi', 'Hindi'],
			['id', 'Indonesian'],
			['it', 'Italian'],
			['ja', 'Japanese'],
			['la', 'Latin'],
			['ne', 'Nepali'],
			['pl', 'Polish'],
			['pt', 'Portuguese'],
			['pa', 'Punjabi (Eastern)'],
			['ru', 'Russian'],
			['sa', 'Sanskrit'],
			['es', 'Spanish'],
			['sv', 'Swedish'],
			['ta', 'Tamil'],
			['te', 'Telugu'],
			['th', 'Thai'],
			['bo', 'Tibetan'],
			['tr', 'Turkish'],
			['uk', 'Ukrainian'],
			['ur', 'Urdu'],
			['vi', 'Vietnamese'],
			['zu', 'Zulu'],
		];
	})();
	const langSelected = 9;
	const t = {
		lang: lang,
		langSelected: langSelected,
		onLoadShowGuide: true,
		refs: {
			outputCon,
			messsCon,
			toastCon,
			selectLang,
			startBtn,
			resetBtn,
			helpBtn,
			guideCon,
			guideCloseBtn,
			currentPara: { p: null, listened: null, listening: null },
		},
		srConfigDefault: {
			interimResults: true,
			continuous: false,
			maxAlternatives: 1,
			lang: lang[langSelected][0],
		},
	};

	t.toast = (message, duration = 2 * 1000) => {
		const root = document.createElement('div');
		root.classList.add('message', 'active');
		let div = document.createElement('div');
		div.classList.add('text');
		div.append(message);
		root.append(div);

		t.refs.toastCon.append(root);

		setTimeout(() => {
			const toastConTop =
				t.refs.toastCon.style.top === ''
					? 0
					: Number(t.refs.toastCon.style.top.slice(0, -2));

			const x = t.refs.toastCon.children[0];
			if (x) {
				let box = x.getBoundingClientRect();
				let style = getComputedStyle(x);
				let paddingTop = Number(style.paddingTop.slice(0, -2));
				let paddingBottom = Number(style.paddingBottom.slice(0, -2));
				let boxInnerHeight = box.height - paddingTop - paddingBottom;
				const mmm = boxInnerHeight + paddingTop;
				let moveTop = toastConTop - mmm;
				t.refs.toastCon.style.top = moveTop + 'px';

				setTimeout(() => {
					let toastConBottom =
						t.refs.toastCon.getBoundingClientRect().bottom;
					let messsConTop =
						t.refs.messsCon.getBoundingClientRect().top;
					if (toastConBottom - messsConTop < 10) {
						t.refs.toastCon.innerHTML = null;
						t.refs.toastCon.style.top = '0px';
					}
					// root && root.parentNode && root.parentNode.removeChild(root)
				}, 700); // Linked with CSS (#toastCon => transition property)
			}
		}, duration);
	};

	t.fun = (() => {
		const funs = {};
		funs.addPara = () => {
			const selected = t.refs.outputCon.querySelectorAll('p.selected');
			if (selected.length > 0) {
				for (let i = 0; i < selected.length; i++) {
					selected[i].classList.remove('selected');
				}
			}

			const root = document.createElement('p');
			root.classList.add('selected');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const span3 = document.createElement('span');
			span1.classList.add('listened');
			span2.innerText = ' ';
			span3.classList.add('listening');
			span3.innerHTML = '<br>';
			root.append(span1, span2, span3);
			t.refs.currentPara.p = root;
			t.refs.currentPara.listened = span1;
			t.refs.currentPara.listening = span3;
			t.refs.outputCon.append(root);

			root.addEventListener('click', funs.selectPara);
			t.refs.outputCon.addEventListener('keydown', funs.paraOnKeyDown);
			// root.addEventListener('keydown', funs.paraOnKeyDown)

			funs.setCursor();
			return {
				p: root,
				listened: span1,
				listening: span3,
			};
		};
		funs.selectPara = (e) => {
			// console.log('OKKKK')
			// const selected = t.refs.outputCon.querySelectorAll('p.selected')
			// if(selected.length > 0){
			// 	for (let i = 0; i < selected.length; i++) {
			// 		selected[i].classList.remove('selected')
			// 	}
			// }
			// e.target.classList.add('selected')
			// t.refs.currentPara.p = e.target
			// t.refs.currentPara.listened = e.target.querySelector('span.listened')
			// t.refs.currentPara.listening = e.target.querySelector('span.listening')
			// console.log(t.refs.currentPara)
			// console.log(e)
		};
		funs.paraOnKeyDown = (e) => {
			if (e.key.toLowerCase() === 'enter') {
				// console.log(e)
				e.preventDefault();
				t.fun.addPara();
			}
		};
		funs.setCursor = () => {
			// const selection = window.getSelection()
			// selection.removeAllRanges()
			// const range = document.createRange()
			// console.log(t.refs.currentPara.listened)
			// t.refs.currentPara.listened.innerText = "hello"
			// range.selectNode(t.refs.currentPara.listened)
			// range.collapse()
			// range.setStart(t.refs.currentPara.listened, 0)
			// range.setEnd(t.refs.currentPara.listened, 3)
			// selection.addRange(range)
			// console.log(selection)
			// console.log(range)
		};
		funs.setupControls = () => {
			/*			Setup [Select language]			*/
			console.log(t.refs.selectLang);
			t.refs.selectLang.append(
				...t.lang.map((lang, i) => {
					const node = document.createElement('option');
					node.innerText = lang[1];
					node.value = i;
					if (t.langSelected === i)
						node.setAttribute('selected', true);
					return node;
				})
			);
			t.refs.selectLang.addEventListener('change', (e) => {
				const index = +e.target.value;
				const opts =
					t.refs.selectLang.querySelectorAll('option[selected]');
				const length = opts.length;
				for (let i = 0; i < length; i++) {
					opts[i].removeAttribute('selected');
				}
				t.refs.selectLang.children[index].setAttribute(
					'selected',
					true
				);

				t.sr.instance.lang = t.lang[index][0];

				t.sr.stop();
				setTimeout(() => {
					t.sr.start();
				}, 200);
			});
			// console.log(t.refs.selectLang.children[t.langSelected], t.langSelected)
			// t.refs.selectLang.children[t.langSelected].selected = true

			/*		Setup [Start Button]		*/
			t.refs.startBtn.innerText = t.sr.listening ? 'Stop' : 'Start';
			t.refs.startBtn.addEventListener('click', (e) => {
				console.log(e);
				if (t.sr.listening) {
					t.sr.stop();
					t.refs.startBtn.innerText = 'Start';
				} else {
					t.sr.start();
					t.refs.startBtn.innerText = 'Stop';
				}
			});

			/*		Setup [Reset Button]		*/
			t.refs.resetBtn.addEventListener('click', (e) => {
				window.location.href = '/';
			});

			/*		Setup [Help Button]		*/
			t.refs.helpBtn.addEventListener('click', (e) => {
				t.guide.show();
				// console.log(e)
			});
			t.refs.guideCloseBtn.addEventListener('click', (e) => {
				t.guide.hide();
				// console.log(e)
			});
		};
		return funs;
	})();
	t.sr = (() => {
		const s = {
			instance: null,
			listening: false,
			transcriptTextArray: [],
			cmds: {},
		};

		s.createInstance = () => {
			let sro = [
				'SpeechRecognition',
				'webkitSpeechRecognition',
				'mozSpeechRecognition',
				'msSpeechRecognition',
				'oSpeechRecognition',
			]; // speech recognition object
			for (var i = 0; i < sro.length; i++) {
				if (sro[i] in window) {
					s.srAPItype = sro[i];
					// console.log("Your browser supports : "+sro[i]);
					switch (sro[i]) {
						case 'SpeechRecognition':
							s.instance = new SpeechRecognition();
							break;
						case 'webkitSpeechRecognition':
							s.instance = new webkitSpeechRecognition();
							break;
						case 'mozSpeechRecognition':
							s.instance = new mozSpeechRecognition();
							break;
						case 'msSpeechRecognition':
							s.instance = new SpeechRecognition();
							break;
						case 'oSpeechRecognition':
							s.instance = new oSpeechRecognition();
							break;
						default:
							s.instance = null;
							break;
					}

					if (s.instance !== null) {
						for (const key in t.srConfigDefault) {
							// Set Default Setting
							s.instance[key] = t.srConfigDefault[key];
						}

						s.instance.onend = () => {
							console.log('end');
							if (t.refs.currentPara.listening.innerText !== '') {
								const listenedText =
									t.refs.currentPara.listened.innerText;
								let listeningText =
									t.refs.currentPara.listening.innerText;

								if (s.cmds[listeningText.toLowerCase()]) {
									s.cmds[listeningText.toLowerCase()]();
								} else {
									if (
										t.refs.currentPara.listening
											.innerHTML !== '<br>'
									) {
										if (
											listenedText.length === 0 ||
											listenedText.slice(-1) === '.'
										) {
											listeningText =
												listeningText
													.slice(0, 1)
													.toUpperCase() +
												listeningText.slice(1);
										}
										s.transcriptTextArray.push(
											listeningText
										);
										t.refs.currentPara.listened.innerText +=
											(listenedText.length > 0
												? ' '
												: '') + listeningText;
										t.refs.currentPara.listening.innerText =
											'';
									}
								}
								t.fun.setCursor();
							}

							// Continue listening
							// s.instance.stop()
							if (s.listening) {
								s.instance.start();
							}
						};

						s.instance.onresult = (e) => {
							// console.log(e.results)
							const transcript = e.results[0][0].transcript;
							if (transcript !== null && transcript !== '') {
								t.refs.currentPara.listening.innerText =
									transcript;
							}
						};
					}

					(() => {
						s.cmds['cut cut'] = () => {
							if (s.transcriptTextArray.length > 0) {
								const a = s.transcriptTextArray.pop();
								const newText =
									t.refs.currentPara.listened.innerText
										.slice(0, -a.length)
										.trim();
								t.refs.currentPara.listened.innerText = newText;
								t.refs.currentPara.listening.innerHTML =
									newText.length === 0 ? '<br>' : null;
							} else {
								t.refs.currentPara.listened.innerText = null;
								t.refs.currentPara.listening.innerHTML = '<br>';
							}
						};
						s.cmds['next line'] = () => {
							if (s.transcriptTextArray.length > 0) {
								const x =
									t.refs.currentPara.listened.innerText.trim();
								if (x.slice(-1) !== '.')
									t.refs.currentPara.listened.innerText +=
										'.';
								t.refs.currentPara.listening.innerHTML = null;
							} else {
								t.refs.currentPara.listened.innerText = null;
								t.refs.currentPara.listening.innerHTML = '<br>';
							}
							s.transcriptTextArray = [];
							t.fun.addPara();
							t.refs.outputCon.scrollTo(
								0,
								t.refs.outputCon.scrollHeight
							);
						};
						s.cmds['full stop'] = () => {
							if (s.transcriptTextArray.length > 0) {
								t.refs.currentPara.listened.innerText =
									t.refs.currentPara.listened.innerText.trim() +
									'.';
								t.refs.currentPara.listening.innerHTML = null;
							} else {
								t.refs.currentPara.listened.innerText = null;
								t.refs.currentPara.listening.innerHTML = '<br>';
							}
						};
						s.cmds['copy text'] = () => {
							if (s.transcriptTextArray.length > 0) {
								t.refs.currentPara.listening.innerHTML = null;
							} else {
								t.refs.currentPara.listened.innerText = null;
								t.refs.currentPara.listening.innerHTML = '<br>';
							}
							let text = '';
							const p =
								t.refs.outputCon.querySelectorAll(
									'span.listened'
								);
							const length = p.length;
							for (let i = 0; i < length; i++) {
								text += p[i].innerText + '\n';
							}
							navigator.clipboard.writeText(text).then(() => {
								t.toast('Copied as Plain Text');
							});
						};
						s.cmds['copy html'] = () => {
							if (s.transcriptTextArray.length > 0) {
								t.refs.currentPara.listening.innerHTML = null;
							} else {
								t.refs.currentPara.listened.innerText = null;
								t.refs.currentPara.listening.innerHTML = '<br>';
							}
							let text = '';
							const p =
								t.refs.outputCon.querySelectorAll(
									'span.listened'
								);
							const length = p.length;
							for (let i = 0; i < length; i++) {
								text += '<p>' + p[i].innerText + '</p>\n';
							}
							navigator.clipboard.writeText(text).then(() => {
								t.toast('Copied as HTML');
							});
						};
					})();

					return;
				}
			}
		};
		s.start = () => {
			s.listening = true;
			s.instance.start();
		};
		s.stop = () => {
			s.listening = false;
			s.instance.abort();
			s.instance.stop();
		};

		if (s.instance === null) s.createInstance();

		return s;
	})();

	t.guide = (() => {
		const guide = {
			isVisible:
				window.localStorage.getItem('onLoadShowGuide') === 'false'
					? false
					: true,
		};
		guide.show = () => {
			t.refs.guideCon.classList.add('show');
		};
		guide.hide = () => {
			t.refs.guideCon.classList.remove('show');
			if (window.localStorage.getItem('onLoadShowGuide') !== 'false') {
				window.localStorage.setItem('onLoadShowGuide', 'false');
			}
		};
		if (guide.isVisible) guide.show();
		else guide.hide();
		return guide;
	})();

	t.init = () => {
		t.refs.outputCon.innerHTML = null;
		t.fun.setupControls();
		t.fun.addPara();

		// t.guide.show()

		// for(let i=0; i < 25; i++) t.fun.addPara()
	};

	return t;
};

const testing = (() => {
	const t = {};
	t.toast = () => {
		const app = App();
		console.log(app);
		app.toast('Hello 1');
		setTimeout(() => {
			app.toast('Hello 2');
			setTimeout(() => {
				app.toast('Hello 3');
				setTimeout(() => {
					app.toast('Hello 4');
				}, 1000);
			}, 1000);
		}, 1000);
		console.log(app);

		return app;
	};
	t.addPara = () => {
		const app = App();
		console.log(app);
		app.init();

		return app;
	};

	return t;
})();

// const app = App()
// console.log(app)
// app.init()

// const app = testing.toast()
const app = testing.addPara();

let MySR = function(outputContainerSelector){
	this.outputContainer = document.querySelectorAll(outputContainerSelector)[0];
	let paraEle = this.getNextPara();

	let newLineStarted = true;

	let sr = this.createSRInstance();
	
	let srActive = false;
	// let srSlept = true;


	sr.interimResults = true;
	sr.continuous = false;
	sr.maxAlternatives = 1;
	sr.lang = 'en';
	
	sr.onstart = function(){
		// console.log("onstart");
		// srSlept = false;
	}
	
	sr.onend = function(e){
		// console.log("onend");
		// srSlept = true;

		if(srActive){
			sr.start();
		}
	}

	sr.onresult = function(e){
		// console.log(e.results);
		for (let i = 0; i < e.results.length; i++) {
			for (let j = 0; j < e.results[i].length; j++) {
				
				if(e.results[i].isFinal){
					paraEle[1].innerHTML = "";
					let s = document.createElement("span");
					if(newLineStarted){
						newLineStarted = false;
						s.classList.add("newLine");
						
						let str = e.results[i][j].transcript.trim();
						s.innerText = " "+str.charAt(0).toUpperCase() + str.slice(1);
						// // console.log(str);

						// if(paraEle[0].children.length > 1){
						// 	// paraEle[1].before(document.createTextNode("."));
						// 	let dotSpace = document.createElement("span");
						// 	dotSpace.innerText = ". ";
						// 	paraEle[1].before(dotSpace);
						// }

						paraEle[1].before(s);
					}
					else{
						s.innerText = " "+e.results[i][j].transcript;
						paraEle[1].before(s);
					}
				}
				else{
					if(i===0 && j===0){
						paraEle[1].innerHTML = "";
					}
					if(paraEle[0].children.length === 1){
						paraEle[1].appendChild( document.createTextNode(e.results[i][j].transcript) );
					}
					else{
						paraEle[1].appendChild( document.createTextNode(" " + e.results[i][j].transcript) );
					}
				}
			}
		}
	}

	this.start = function(){
		if(!srActive){
			sr.start();
			srActive = true;
		}
	}
	
	this.stop = function(){
		if(srActive){
			sr.stop();
			srActive = false;
		}
	}

	this.setNextPara = function(){
		if(paraEle[0].children.length > 1){
			this.enterDot();
			paraEle = this.getNextPara();
			newLineStarted = true;
		}
	}
	
	this.setNextLine = function(){
		newLineStarted = true;

		this.enterDot();
	}
	
	this.enterComma = function(){
		if(paraEle[0].children.length > 1){
			paraEle[1].before( document.createTextNode(",") );
		}
	}
	this.enterDot = function(){
		if(paraEle[0].children.length > 1){
			paraEle[1].before( document.createTextNode(".") );
		}
	}
	this.setCopy = function(){
		let content = this.outputContainer.cloneNode(true);
		console.log(content);
		let final = document.createElement("div");
		if(content.children.length > 0){
			for(let i=0; i<content.children.length; i++){
				let p = document.createElement("p");
				p.appendChild(document.createTextNode(content.children[i].innerText));
				final.append(p);
			}
			console.log(final);
			
			final.style.height = '0px';
			final.style.width = '0px';
			final.style.overflow = 'hidden';
			document.body.appendChild(final);


			let selection = window.getSelection();
				selection.removeAllRanges();
				selection.selectAllChildren(final);

			document.addEventListener('copy', function(e) {
				// console.log(e);
				e.preventDefault();
				e.clipboardData.setData('text/html', final.innerHTML);
				document.execCommand("copy");
			});
			
			document.execCommand("copy");
			// document.getElementsByTagName('body')[0].removeChild(div);
			document.body.removeChild(final);
		}
	}

	this.bindKeyboardEvents();
}


MySR.prototype.linkSRButton = function(selector, innerHTML = 'Listing ...'){
	let mySR = this;
	let ele = document.querySelectorAll(selector)[0];
	let defaultInnerHTML = ele.innerHTML;
	let activeClass = "speechRecognitionActive";
	
	// console.log(mySR);
	// console.log(ele);

	ele.addEventListener('click', function(){
		if(this.classList.contains(activeClass)){
			this.classList.remove(activeClass);
			this.innerText = defaultInnerHTML;
			mySR.stop();
		}
		else{
			this.classList.add(activeClass);
			this.innerText = innerHTML;
			mySR.start();
		}
		
	}, false);
}
MySR.prototype.linkCopyButton = function(selector){
	let mySR = this;
	let ele = document.querySelectorAll(selector)[0];
	ele.addEventListener('click', function(){
		mySR.setCopy();
	});
}
MySR.prototype.createSRInstance = function(){
	let sro = ["SpeechRecognition","webkitSpeechRecognition","mozSpeechRecognition","msSpeechRecognition","oSpeechRecognition"]; // speech recognition object
	for(var i=0; i<sro.length; i++){
		if(sro[i] in window){
			//console.log("Your browser supports : "+sro[i]);
			switch(sro[i]){
				case "SpeechRecognition": return new SpeechRecognition();
				case "webkitSpeechRecognition": return new webkitSpeechRecognition();
				case "mozSpeechRecognition": return new mozSpeechRecognition();
				case "msSpeechRecognition": return new SpeechRecognition();
				case "oSpeechRecognition": return new oSpeechRecognition();
				default: return null;
			}
		}
	}
}
MySR.prototype.getNextPara = function(){
	let p = document.createElement('p');
	let span = document.createElement('span');
	p.appendChild(span);
	this.outputContainer.appendChild(p);
	return [p, span];
}
MySR.prototype.bindKeyboardEvents = function(){
	let mySR = this;
	document.addEventListener('keyup', function(e){
		if(e.ctrlKey){
			// console.log(e.keyCode);
			switch(e.keyCode){
				case 188:
					mySR.enterComma();
					break;
				case 190:
					mySR.enterDot();
					break;
				case 191:
					mySR.setNextLine();
					break;
				case 186:
					mySR.setNextPara();
					break;
			}
		}
	});
}



let mySR = new MySR("#resultContainer");
// console.log(mySR);
mySR.linkSRButton("#srButton");
mySR.linkCopyButton("#copyButton");




function show_message(message){
	let hidder_div = messages_div.querySelectorAll('div.hidder_div');
	if(hidder_div.length > 0){
		hidder_div = hidder_div[0];
		let messagesNode = document.createElement('div');
		let messageInnerNode = document.createElement('div');
		messagesNode.classList.add('message');
		messageInnerNode.innerText = message;
		messagesNode.appendChild(messageInnerNode);
		hidder_div.appendChild(messagesNode);
		messagesNode.classList.add('active');
	}

	setTimeout(function(){
		let message_height;
		let hidderNodes = messages_div.querySelectorAll('div.hidder_div');
		if(hidderNodes.length > 0){
			hidderNodes[0].classList.add('active');
			messages_div.classList.add('active');
			
			let innerNodes = messages_div.querySelectorAll('div.message');
			if(innerNodes.length > 0){
				//console.log(innerNodes[0].style);
				message_height = innerNodes[0].offsetHeight;
				messages_div_height = messages_div.offsetHeight;
				let styleNodes = messages_div.querySelectorAll('div.style_div');
				if(styleNodes.length > 0){
					let str = `<style>
						@keyframes message_hide_ani {
							0%{
								transform: translateY(0px);
							}
							100%{
								transform: translateY(-`+(parseInt(message_height) - 5)+`px);
							}
						}
						@keyframes message_height_ani {
							0%{
								height: `+messages_div_height+`px;
							}
							100%{
								height: `+(parseInt(messages_div_height) - parseInt(message_height))+`px;
							}
						}
						</style>
					`;
					styleNodes[0].innerHTML = str;
				}
				setTimeout(function(){
					hidderNodes[0].classList.remove('active');
					messages_div.classList.remove('active');
					messages_div.style.height = 'fit-content';
					innerNodes[0].parentNode.removeChild(innerNodes[0]);
				}, 500);
			}
		}
		
	}, 2000);
}
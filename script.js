let page = localStorage.setItem("pages", "1");
let pa = localStorage.getItem("pages");
let pages = Number(pa);
const btn = document.querySelector("#quote-btn");
let heading = document.querySelector("h1");
const quotesShow = document.querySelector("#quotes-show");
const quotesView = document.querySelector("#paragraph");
const openPopup = document.querySelector(".open-popup");
const closePopup = document.querySelector(".close-popup");
const popup = document.querySelector(".popup");

btn.addEventListener("click", async (event) => {
	event.preventDefault();

	const randomData = await fetch("https://api.quotable.io/quotes/random");
	const data = await randomData.json();
	console.log(data[0]);
});

let index = 0;
let arr = [
	"Motivation",
	"Inspiration",
	"Encouragement",
	"Energy",
	"Aspiration",
	"Eagerness",
];
const vergoJI = "AIzaSyBzxYdZGGZb6e_f208xGaceQNjWny4leKc";
async function getChat(prompt) {
	try {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${vergoJI}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				model: "gemini-1.5-flash",
				generationConfig: {
					candidateCount: 1,
					// stopSequences: ["x"],
					maxOutputTokens: 10,
					temperature: 2.0,
				},
				body: JSON.stringify({
					contents: {
						role: "user",
						parts: {
							text: prompt,
						},
					},
				}),
			}
		);

		const data = await response.json();
		// console.log(data);
		return data.candidates[0].content.parts[0].text;
	} catch (error) {
		console.log(error);
		throw new Error("SomeThing Went Wrong");
	}
}

const typeWrite = (arr) => {
	heading.innerText = `Quotes is ${arr[index]}`;
	index < arr.length - 1 ? index++ : (index = 0);
	setTimeout(() => {
		typeWrite(arr);
	}, 900);
};
typeWrite(arr);

async function numb(pages) {
	const sec = document.querySelector(".sec");
	pages = Number(localStorage.getItem("pages"));
	try {
		if (
			navigator.userAgentData.platform === "Android" ||
			navigator.userAgentData.platform === ""
		) {
			throw new Error("Please try again or open in PC");
		}
		let Data = await dataLive(pages);
		for (let i = 0; i < Data.results.length; i++) {
			let div = document.createElement("div");
			let block = document.createElement("blockquote");
			let span = document.createElement("span");
			let aiBtn = document.createElement("button");
			let sbtn = document.createElement("div");
			div.setAttribute("class", "box");
			span.setAttribute("class", "author child");
			block.setAttribute("class", "blockquote child");
			aiBtn.setAttribute("class", "ai-btn child open-popup");
			aiBtn.setAttribute("title", "Summarize Quotes By A.I");
			aiBtn.innerText = "AI";
			sbtn.setAttribute("class", "sbtn child");
			sbtn.append(span, aiBtn);
			div.append(block, sbtn);
			block.innerText = `${"\u{201C}"}  ${
				Data.results[i].content
			} ${"\u{201D}"}`;
			span.innerText = Data.results[i].author;
			sec.appendChild(div);
			aiBtn.addEventListener("click", async (event) => {
				event.stopPropagation();
				const userValue = `summarize this quotes ${block.innerText}`;
				let input = block.innerText;
				let exFromLocalStorage =
					JSON.parse(localStorage.getItem("userValueData")) || {};
				let exFromLocalStorageLength =
					Object.keys(exFromLocalStorage).length || 0;
				try {
					if (exFromLocalStorageLength && exFromLocalStorage) {
						if (exFromLocalStorageLength <= 10 && input in exFromLocalStorage) {
							popup.classList.add("open-pop");
							quotesView.textContent = exFromLocalStorage[input];
							quotesShow.append(quotesView);
							// console.log("caches");
						} else {
							if (exFromLocalStorageLength < 10) {
								let newKey = input;
								let newValue = await getChat(userValue);
								exFromLocalStorage = {
									[newKey]: newValue,
									...exFromLocalStorage,
								};
								// console.log(exFromLocalStorage);
								localStorage.setItem(
									"userValueData",
									JSON.stringify(exFromLocalStorage)
								);
								popup.classList.add("open-pop");
								quotesView.textContent = exFromLocalStorage[input];
								quotesShow.append(quotesView);
								// console.log("new key");
							} else {
								let lastKey = Object.keys(exFromLocalStorage).pop();
								delete exFromLocalStorage[lastKey];
								let newKey = input;
								let newValue = await getChat(userValue);
								exFromLocalStorage = {
									[newKey]: newValue,
									...exFromLocalStorage,
								};
								// console.log(exFromLocalStorage);
								localStorage.setItem(
									"userValueData",
									JSON.stringify(exFromLocalStorage)
								);
								popup.classList.add("open-pop");
								quotesView.textContent = exFromLocalStorage[input];
								quotesShow.append(quotesView);
								// console.log("out of range");
							}
						}
					} else {
						let data = await getChat(userValue);
						localStorage.setItem(
							"userValueData",
							JSON.stringify({
								[input]: data,
							})
						);
						popup.classList.add("open-pop");

						quotesView.textContent = data;
						quotesShow.append(quotesView);
						// console.log("first time");
					}
				} catch (error) {
					console.log(error);
				}
			});
		}
		pages = pages + 1;
		localStorage.setItem("pages", pages);
	} catch (error) {
		let div = document.createElement("div");
		let parg = document.createElement("p");
		let parg1 = document.createElement("p");
		btn.style.display = "none";
		div.setAttribute("class", "error");
		parg.innerText = "404 Not Found";
		parg.setAttribute("class", "parg");
		parg1.innerText = "Please try again or open in PC";
		parg1.setAttribute("class", "parg1");
		parg.style.color = "white";
		parg1.style.color = "white";
		div.append(parg, parg1);
		sec.appendChild(div);
		callErr();
	}
}

var count;
async function dataLive(page) {
	let response;
	try {
		response = await fetch(
			`https://api.realinspire.tech/v1/quotes?page=${page}`
		);
	} catch (error) {
		throw new Error("some thing happen");
	}
	try {
		if (response.ok) {
			const data = await response.json();
			flag = true;
			return data;
		}
	} catch (error) {
		throw new Error("Network response was not ok");
	}
}

function loadMoreItems(pages) {
	numb(pages);
}

const options = {
	root: null,
	rootMargin: "0px",
	threshold: 1,
};
var count;
const callback = (entries) => {
	const [entry] = entries;

	count = Number(localStorage.getItem("pages")) || count++;
	if (Number(localStorage.getItem("pages")) === 0) {
		localStorage.setItem("pages", count);
	}
	if (flag) {
		if (entry.isIntersecting && Number(localStorage.getItem("pages")) > 1) {
			loadMoreItems(pages);
			flag = false;
		}
	}
};

function callErr() {
	loading.style.display = "none";
}
const observe = new IntersectionObserver(callback, options);

const loading = document.querySelector("#loader");
let flag = true;
observe.observe(loading);

numb(pages);

closePopup.addEventListener("click", () => {
	popup.classList.remove("open-pop");
});

const top1 = document.querySelector("#top");
const body = document.querySelector("body");
window.addEventListener("scroll", () => {
	let scrollPosition = window.scrollY;
	if (scrollPosition > window.innerHeight) {
		top1.style.display = "block";
	} else {
		top1.style.display = "none";
	}
});


top1.addEventListener("click", (event) => {
	event.stopPropagation();
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
});

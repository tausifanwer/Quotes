let page = localStorage.setItem("pages", "1");
let pa = localStorage.getItem("pages");
let pages = Number(pa);
const btn = document.querySelector("#quote-btn");

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

let heading = document.querySelector("h1");

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
		let Data = await dataLive(pages);
		for (let i = 0; i < Data.results.length; i++) {
			let div = document.createElement("div");
			let block = document.createElement("blockquote");
			let span = document.createElement("span");
			div.setAttribute("class", "box");
			span.setAttribute("class", "author child");
			block.setAttribute("class", "blockquote child");
			div.append(block, span);
			block.innerText = `${"\u{201C}"}  ${
				Data.results[i].content
			} ${"\u{201D}"}`;
			span.innerText = Data.results[i].author;
			sec.appendChild(div);
		}
		pages = pages + 1;
		localStorage.setItem("pages", pages);
	} catch (error) {
		let div = document.createElement("div");
		let parg = document.createElement("p");
		div.setAttribute("class", "error");
		parg.innerText = "404 Not Found";
		parg.style.color = "white";
		div.appendChild(parg);
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
var count
const callback = (entries) => {
	const [entry] = entries;

	count = Number(localStorage.getItem("pages")) || count++;
	if (Number(localStorage.getItem("pages")) === 0) {
		localStorage.setItem("pages", count);
		}
	if (entry.isIntersecting && Number(localStorage.getItem("pages")) > 1) {
		loadMoreItems(pages);
	}
	
};

function callErr() {
	loading.style.display = "none";
}
const observe = new IntersectionObserver(callback, options);

const loading = document.querySelector("#loader");

observe.observe(loading);

numb(pages);

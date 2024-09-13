let count = 0;
let page = localStorage.setItem("pages", "1");
let pa = localStorage.getItem("pages");
let pages = Number(pa);
const limits = 5;

// console.log(pages+"global");
let index = 0
let arr = [
	"Motivation", 
	"Inspiration",
	"Encouragement",
	"Energy",
	"Aspiration",
	"Eagerness", 
];

let heading = document.querySelector("h1")

const typeWrite = (arr) => {
    
    heading.innerText = `Quotes is ${arr[index]}`;
	index < arr.length-1 ? index++ : (index = 0);
    setTimeout(() => {
        typeWrite(arr)
    },900)
}
typeWrite(arr)


async function numb(pages, limits) {
	const sec = document.querySelector(".sec");
	pages = Number(localStorage.getItem("pages"));
	try {
		let Data = await dataLive(pages, limits);
		for (let i = 0; i < limits; i++) {
			let div = document.createElement("div");
			let block = document.createElement("blockquote");
			let span = document.createElement("span");
			div.setAttribute("class", "box");
			span.setAttribute("class", "author");
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
        // debugger
        

	}
}

async function dataLive(page, limit) {
	// console.log(page,limit);
	const response = await fetch(
		`https://api.quotable.io/quotes?page=${page}&limit=${limit}`
	);
	try {
		if (response.ok) {
			const data = await response.json();
			return data;
		}
	} catch (error) {
		console.log("hi");
		throw new Error("Error");
	}
}

function loadMoreItems(pages) {
	numb(pages, limits);
}
const options = {
	root: null,
	rootMargin: "0px",
	threshold: 1,
};
const callback = (entries) => {
    // console.log(observe);
    const [entry] = entries;
    // debugger
	if (entry.isIntersecting && Number(localStorage.getItem("pages")) > 1) {
        loadMoreItems(pages);
        
    }
    
    
};
 
const observe = new IntersectionObserver(callback, options);

const loading = document.querySelector("#loader");

observe.observe(loading);

numb(pages, limits);

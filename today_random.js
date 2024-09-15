const time = document.querySelector("#time");
let date = new Date();
let hEle = document.querySelector("#h");
let mEle = document.querySelector("#m");
let sEle = document.querySelector("#s");
let dot1 = document.querySelector("#dot1");
let dot2 = document.querySelector("#dot2");
let paragraph = document.querySelector("blockquote");
let authorName = document.querySelector(".author");

let localStorageData = localStorage.getItem("data");

if (localStorageData === null) {
	paragraph.textContent = `${"\u{201C}"}  ${"The best preparation for tomorrow is doing your best today."} ${"\u{201D}"}`;
	authorName.textContent = "H. Jackson Brown Jr.";
} else {
	setTimeout(() => {
		paragraph.textContent = `${"\u{201C}"}  ${
			JSON.parse(localStorageData).content
		} ${"\u{201D}"}`;
		authorName.textContent = JSON.parse(localStorageData).author;
	}, 1300);
}

// time.append(hEle, mEle, sEle);

function countDown() {
	let date = new Date();
	let h = date.getHours();
	let m = date.getMinutes();
	let s = date.getSeconds();
	return [h, m, s];
}

async function random() {
	const response = await fetch("https://api.quotable.io/quotes/random");
	const data = await response.json();
	return data;
}

setInterval(async () => {
	let a = countDown();
	// Update seconds
	let seconds = 60 - a[2] - 1;
	sEle.textContent = seconds <= 9 ? "0" + seconds : seconds;
	dot1.textContent = ":";
	// Update minutes
	let minutes = 60 - a[1] - 1;
	mEle.textContent = minutes <= 9 ? "0" + minutes : minutes;
	dot2.textContent = ":";
	// Update hours
	let hours = 24 - a[0] - 1;
	hEle.textContent = hours <= 9 ? "0" + hours : hours;

	// Check if it's the end of the day
	if (seconds === 0 && minutes === 0 && hours === 0) {
		// Fetch new data and update paragraph content
		let data = await random();
		localStorage.setItem(
			"data",
			JSON.stringify({
				content: data[0].content,
				author: data[0].author,
			})
		);
		let showData = localStorage.getItem("data");
		paragraph.textContent = `${"\u{201C}"}  ${
			JSON.parse(showData).content
		} ${"\u{201D}"}`;
		authorName.textContent = JSON.parse(showData).author;
	}
}, 1000);

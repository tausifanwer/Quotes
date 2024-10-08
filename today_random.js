let date = new Date();
const time = document.querySelector("#time");
let hEle = document.querySelector("#h");
let mEle = document.querySelector("#m");
let sEle = document.querySelector("#s");
let dot1 = document.querySelector("#dot1");
let dot2 = document.querySelector("#dot2");
let paragraph = document.querySelector("blockquote");
let authorName = document.querySelector(".author");

let localStorageData = localStorage.getItem("data");

try {
	if (
		navigator.userAgentData.platform === "Android" ||
		navigator.userAgentData.platform === ""
	) {
		throw new Error("Please try again or open in PC");
	}
} catch (error) {
	const today = document.querySelector("#today");
	today.style.display = "none";
}

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
	const response = await fetch("https://api.realinspire.tech/v1/quotes/random");
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
	if (seconds === 0 && minutes === 0 && hours === 13) {
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

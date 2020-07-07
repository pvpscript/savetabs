var text = "Just a sample text to test stuff";

var blob = new Blob([text], {type: "text/plain"});
var url = URL.createObjectURL(blob);
console.log(`URL: ${url}`);

chrome.downloads.download({url: url, filename: "test_name", saveAs: true}, (downloadId) => {
});

function createBlobUrl(content, type) {
	const blob = new Blob([content], {type: type});
	const url = URL.createObjectURL(blob);

	return url;
}

function plainText(tabs, raw) {
	const tabMap = new Map();
	tabs.map(t => {
		(winList = tabMap.get(t.windowId))
			? winList.push(t)
			: tabMap.set(t.windowId, [t])
	});

	let content = "";
	let newline = false;

	for (let k of tabMap.keys()) {
		const wTabs = tabMap.get(k);
		if (!raw) {
			content += newline ? "\n" : "";
			content += `---------- WINDOW ${k} ----------\n`;

			newline = true;
		}
		wTabs.map(t => content += t.url + "\n");
	}
	
	const url = createBlobUrl(content, "text/plain");

	chrome.downloads.download({
		url: url,
		filename: "plain_text.txt",
		saveAs: true
	}, (downloadId) => {
	});
}

function json(tabs) {
}

const methods = {
	"plain_text": (tabs) => plainText(tabs, false),
	"plain_text_raw": (tabs) => plainText(tabs, true),
	"json": (tabs) => json(tabs)
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const queryInfo = {currentWindow: request.wOpt};
	const action = methods[request.type];

	chrome.tabs.query(queryInfo, (tabs) => {
		action(tabs);
		console.log("Query info");
		console.log(queryInfo);
		console.log(tabs);
	});
});

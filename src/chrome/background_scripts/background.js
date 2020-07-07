var text = "Just a sample text to test stuff";

var blob = new Blob([text], {type: "text/plain"});
var url = URL.createObjectURL(blob);
console.log(`URL: ${url}`);

chrome.downloads.download({url: url, filename: "test_name", saveAs: true}, (downloadId) => {
});

function plainText(tabs, raw) {
}

function json(tabs) {
}

const methods = {
	"plain_text": (tabs) => plainText(tabs, false),
	"plain_text_raw": (tabs) => plainText(tabs, true),
	"json": (tabs) => json(tabs)
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const queryInfo = {
		currentWindow: request.wOpt,
	};
	const action = methods[request.type];

	chrome.tabs.query(queryInfo, (tabs) => {
		action(tabs);
	});
});

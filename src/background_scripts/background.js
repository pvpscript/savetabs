function createBlobUrl(content, type) {
	const blob = new Blob([content], {type: type});
	const url = URL.createObjectURL(blob);

	return url;
}

function plainText(tabs, save, raw) {
	const date = new Date();
	let content = "";

	if (!raw) {
		const tabMap = new Map();
		tabs.map(t => {
			(winList = tabMap.get(t.windowId))
				? winList.push(t)
				: tabMap.set(t.windowId, [t])
		});

		let newline = false;

		for (let k of tabMap.keys()) {
			const wTabs = tabMap.get(k);

			content += newline ? "\n" : "";
			content += `---------- WINDOW ${k} ----------\n`;
			newline = true;

			wTabs.map(t => content += t.url + "\n");

		}
	} else {
		tabs.map(t => content += t.url + "\n");
	}
	
	const url = createBlobUrl(content, "text/plain");
	const filename = date.toISOString().replace(/:/g, "-") + "-tabs" +
		(raw ? "-raw" : "") + ".txt";

	chrome.downloads.download({
		url: url,
		filename: filename,
		saveAs: save,
	}, (downloadId) => {
	});
}

function json(tabs, save, readable) {
	const date = new Date();
	const tabObj = {};

	tabs.map(t => {
		(winList = tabObj[t.windowId])
			? winList.push({
				title: t.title,
				url: t.url
			})
			: tabObj[t.windowId] = [{
				title: t.title,
				url: t.url
			}]
	});

	const content = readable
		? JSON.stringify(tabObj, null, "\t")
		: JSON.stringify(tabObj);
	const url = createBlobUrl(content, "text/json");
	const filename = date.toISOString().replace(/:/g, "-") + "-tabs-" +
		(readable ? "readable" : "minified") + ".json";

	chrome.downloads.download({
		url: url,
		filename: filename,
		saveAs: save,
	}, (downloadId) => {
	});
}

const methods = {
	"ptxt": (tabs, save) => plainText(tabs, save, false),
	"ptxtr": (tabs, save) => plainText(tabs, save, true),
	"jsonm": (tabs, save) => json(tabs, save, false),
	"jsonr": (tabs, save) => json(tabs, save, true),
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const queryInfo = {currentWindow: request.wOpt};
	const action = methods[request.type];

	chrome.tabs.query(queryInfo, (tabs) => {
		action(tabs, request.save);
		console.log("Query info");
		console.log(queryInfo);
		console.log(tabs);
	});
});

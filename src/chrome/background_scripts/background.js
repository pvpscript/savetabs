var text = "Just a sample text to test stuff";

var blob = new Blob([text], {type: "text/plain"});
var url = URL.createObjectURL(blob);
console.log(`URL: ${url}`);

chrome.downloads.download({url: url, filename: "test_name", saveAs: true}, (downloadId) => {
});

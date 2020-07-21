const form = document.getElementById("opt-form");
const fgroup = document.getElementById("field-group");

const ptext = document.getElementById("plaintext");
const ewin = document.getElementById("ewin");
const raw = document.getElementById("raw");

const json = document.getElementById("json");
const mini = document.getElementById("mini");
const readable = document.getElementById("readable");

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const elements = e.target.elements;
	console.log(elements);

	chrome.runtime.sendMessage({
		wOpt: elements['cwin'].checked ? true : undefined,
		type: elements['plaintext'].checked
			? (elements['raw'].checked
				? "ptxtr"
				: "ptxt")
			: (elements['mini'].checked
				? "jsonm"
				: "jsonr"),
		save: e.submitter.name === "saveas" ? true : false,
	});
});

fgroup.addEventListener("change", (e) => {
    raw.disabled = !ptext.checked;
    if (raw.disabled) {
	    raw.checked = false;
    }
    mini.disabled = readable.disabled = !json.checked;
});

const form = document.getElementById("opt-form");
const fgroup = document.getElementById("field-group");
const ptext = document.getElementById("plaintext");
const ewin = document.getElementById("ewin");
const raw = document.getElementById("raw");

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const elements = e.target.elements;
	console.log(elements);

	chrome.runtime.sendMessage({
		wOpt: elements['cwin'].checked ? true : undefined,
		type: null
	});
});

fgroup.addEventListener("change", (e) => {
  raw.disabled = !(
  	(e.target.id == "ewin" && ptext.checked) ||
  	(e.target.id == "plaintext" && ewin.checked)
  );
});

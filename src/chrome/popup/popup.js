const submit = document.getElementById("submit");
const form = document.getElementById("opt-form");

const fgroup = document.getElementById("field-group");
const ptext = document.getElementById("plaintext");
const ewin = document.getElementById("ewin");
const raw = document.getElementById("raw");

submit.addEventListener("click", (e) => {
	alert("Doing stuff");
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
	console.log(e.target);
});

fgroup.addEventListener("change", (e) => {
  raw.disabled = !(
  	(e.target.id == "ewin" && ptext.checked) ||
  	(e.target.id == "plaintext" && ewin.checked)
  );
});

import "./reset.css";
import "./style.css";

const $ = document.querySelector.bind(document);

function insertAtCursor(myField, myValue) {
	if (myField.selectionStart === 0) {
		myField.value += myValue;
		return;
	}

	const startPos = myField.selectionStart;
	const endPos = myField.selectionEnd;
	myField.value =
		myField.value.substring(0, startPos) +
		myValue +
		myField.value.substring(endPos, myField.value.length);
	myField.selectionStart = startPos + myValue.length;
	myField.selectionEnd = startPos + myValue.length;
}

function bindTabKeyForTextarea() {
	document.querySelectorAll("textarea").forEach((el) => {
		el.addEventListener("keydown", (evt) => {
			if (evt.key === "Tab") {
				evt.preventDefault();
				insertAtCursor(evt.target, "    ");
			}
		});
	});
}

function printCode(script, html, style, id) {
	const result = `<!DOCTYPE html>
  <html lang="zh-Hans" id="${id}" data-time="${Date.now()}">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo it</title>
    <style>${style}</style>
  </head>
    ${html}
  
    <script type="module">
      ${script}
    </script>
  <body>
  </body>`;

	return result;
}

function renderIframe(code) {
	const blob = new File([code], "index.html", { type: "text/html" });
	const uri = URL.createObjectURL(blob);

	$(".result-frame").src = uri;
}

class DemoIt {
	constructor(id) {
		this._scriptEl = $('.editor[role="script"]');
		this._htmlEl = $('.editor[role="html"]');
		this._styleEl = $('.editor[role="style"]');

		if (id) {
			this._id = id;
		} else {
			this._id = Date.now().toString(32);
		}
	}

	getValue() {
		return {
			script: this._scriptEl.value,
			html: this._htmlEl.value,
			style: this._styleEl.value,
		};
	}

	setValue({ script = "", html = "", style = "" }) {
		if (script) {
			this._scriptEl.value = script;
		}

		if (html) {
			this._htmlEl.value = html;
		}
		if (style) {
			this._scriptEl.value = script;
		}
	}

	load() {
		const doc = localStorage.getItem(this._id) ?? "{}";
		const stored = JSON.parse(doc);
		this.setValue({
			script: stored.script ?? "",
			html: stored.html ?? "",
			style: stored.style ?? "",
		});
	}

	save() {
		localStorage.setItem(
			this._id,
			JSON.stringify({
				...this.getValue(),
				updatedAt: Date.now(),
			}),
		);
	}

	render() {
		const content = this.getValue();
		const combined = printCode(
			content.script,
			content.html,
			content.style,
			this._id,
		);
		renderIframe(combined);
		this.save();
	}
}

const app = new DemoIt("default_store");

window.renderIframe = () => {
	app.render();
};

bindTabKeyForTextarea();
app.load();
app.render();

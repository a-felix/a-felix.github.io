var order = [], dom = {}, tableRows = [], saveCode = null, sharedLink = false, autosave = JSON.parse(localStorage.getItem("autosave"));
if (autosave === null) autosave = true;
var toCode = { at: "A", be: "B", cz: "C", de: "D", es: "E", fr: "F", gb: "G", hu: "H", it: "I", is: "J", kz: "K", lu: "L", mt: "M", no: "N", au: "O", pt: "P", mk: "Q", ro: "R", se: "S", tr: "T", ua: "U", si: "V", wa: "W", hr: "X", yu: "Y", az: "Z", am: "a", bg: "b", cy: "c", dk: "d", ee: "e", fi: "f", gr: "g", ch: "h", il: "i", ie: "j", ks: "k", lv: "l", me: "m", nl: "n", md: "o", pl: "p", al: "q", ru: "r", rs: "s", lt: "t", us: "u", sk: "v", mc: "w", ah: "x", by: "y", ba: "z", ma: "0", li: "1", ad: "2", lb: "3", ps: "4", sm: "5", ge: "6", ts: "7", fo: "8", aa: "9", cs: "+", ab: "-", kk: "*", eh: "/", ca: "^", os: "_", ax: "@", ce: "=" };
var fromCode = {};
for (let idx in toCode) { fromCode[toCode[idx]] = idx }
function verifyOrder() {
	var idx = 0, lgt = order.length, ver = {};
	window.ver = ver;
	while (idx < order.length) {
		if (typeof order[idx] === "undefined" || typeof entryInfo[order[idx]] === "undefined" || typeof ver[order[idx]] !== "undefined") {
			order.splice(idx, 1);
			lgt--;
		}
		else {
			ver[order[idx]] = true;
			idx++;
		}
	}
	for (idx in entryInfo) {
		if (typeof ver[idx] === "undefined") {
			order.push(idx);
			ver[idx] = true;
		}
	}
}
function defaultOrder() {
	if (document.URL.indexOf("?") != -1) {
		var savedOrder = [...document.URL.split("?")[1]].map(ch => fromCode[ch]);
		if (savedOrder.length) {
			order = savedOrder;
			verifyOrder();
			if (typeof order[0] !== "undefined") {
				autosave = false;
				sharedLink = true;
			}
			try { history.replaceState(null, null, ".") }
			catch {}
			return;
		}
	}
	if (typeof localStorage.getItem("escSort" + yr) !== "undefined") {
		var savedOrder = localStorage.getItem("escSort" + yr);
		if (savedOrder) {
			savedOrder = [...savedOrder].map(el => fromCode[el]);
			if (savedOrder.length) {
				order = savedOrder;
				verifyOrder();
				try { history.replaceState(null, null, ".") }
				catch {}
				return;
			}
		}
	}
	for (var code in entryInfo) order.push(code);
	//order = ["nl", "it", "mt", "az", "se", "rs", "ch", "dk", "mk", "ro", "fr", "hu", "il", "cz", "cy", "al", "ee", "sm", "lv", "si", "gr", "lt", "es", "am", "be", "no", "pt", "ru", "is", "gb", "ge", "md", "me", "by", "at", "fi", "de", "au", "ie", "hr", "pl"];
	//order = order.sort(() => (Math.random() - 0.5));
}
function initTable() {
	var headers = ["Rank", "Country", "Artist", "Song"];
	var headerRow = document.createElement("TR");
	for (var h of headers) headerRow.appendChild(document.createElement("TH")).appendChild(document.createTextNode(h));
	table.appendChild(headerRow);
}
{/*
	let p1 = function (no) { return no + 1; }
	let m1 = function (no) { return no - 1; }
	let sw = function (no, fn) {
		var ns = fn(no), aux;
		appendCells(no, order[ns]);
		appendCells(ns, order[no]);
		aux = order[no];
		order[no] = order[ns];
		order[ns] = aux;
	}
	function up(no) { sw(no, m1); }
	function dn(no) { sw(no, p1); }
*/}
function appendCells(idx, code) {
	for (var cell of dom[code]) tableRows[idx].appendChild(cell);
	tableRows[idx].className = "show" + entryInfo[code].show;
}
function createRows() {
	for (var count = 0; count < noOfEntries;) {
		let row = document.createElement("TR");
		let rankCell = document.createElement("TD");
		rankCell.className = "rank";
		rankCell.appendChild(document.createTextNode((++count) + "."));
		/*
		let switchCell = document.createElement("TD");
		switchCell.className = "switch";
		let upBtn = document.createElement("BUTTON");
		let dnBtn = document.createElement("BUTTON");
		upBtn.appendChild(document.createTextNode("\u25B2"));
		dnBtn.appendChild(document.createTextNode("\u25BC"));
		upBtn.className = "upBtn";
		dnBtn.className = "dnBtn";
		upBtn.setAttribute("no", count - 1);
		dnBtn.setAttribute("no", count - 1);
		upBtn.onclick = function(){up(parseInt(this.getAttribute("no")));};
		dnBtn.onclick = function(){dn(parseInt(this.getAttribute("no")));};
		if (count == 1) upBtn.setAttribute("disabled", "disabled");
		if (count == noOfEntries) dnBtn.setAttribute("disabled", "disabled");
		switchCell.appendChild(upBtn);
		switchCell.appendChild(dnBtn);
		*/
		row.appendChild(rankCell);
		/* row.appendChild(switchCell); */
		tableRows.push(row);
		table.appendChild(row);
	}
}
function createDummy(str) {
	var result = document.createElement("SPAN");
	result.className = "hid";
	result.appendChild(document.createTextNode(str));
	return result;
}
function createDOMs() {
	var idx = 0;
	for (var code of order) {
		let e = entryInfo[code];
		let flag = document.createElement("IMG");
		flag.src = "flags/" + code + ".png";
		flag.className = "flag";
		let ctyCell = document.createElement("TD");
		ctyCell.appendChild(flag);
		ctyCell.appendChild(document.createTextNode(e.country));
		ctyCell.appendChild(createDummy(":"))
		let artCell = document.createElement("TD");
		if (e.artist[0] == "	") {
			artCell.appendChild(document.createTextNode(e.artist.substring(1)));
			artCell.className = "TBD";
		}
		else artCell.appendChild(document.createTextNode(e.artist));
		artCell.appendChild(createDummy(" -"))
		let sngCell = document.createElement("TD");
		if (e.song[0] == "	") {
			sngCell.appendChild(document.createTextNode(e.song.substring(1)));
			sngCell.className = "TBD";
		}
		else {
			let sngQuotes = sngCell.appendChild(document.createElement("SPAN"));
			sngQuotes.className = "quoted";
			sngQuotes.appendChild(document.createTextNode(e.song));
			sngCell.appendChild(sngQuotes);
			if (e.note) {
				let sngNote = document.createElement("SPAN");
				sngNote.className = "note";
				sngNote.appendChild(document.createTextNode(" ("));
				let sngNoteNote = sngNote.appendChild(document.createElement("SPAN"))
				sngNoteNote.className = "note";
				sngNoteNote.appendChild(document.createTextNode(e.note));
				sngNote.appendChild(document.createTextNode(")"));
				sngCell.appendChild(sngNote);
			}
		}
		dom[code] = [ctyCell, artCell, sngCell];
		appendCells(idx, code);
		idx++;
	}
}
function showEntries() {
	for (var idx in order) {
		let code = order[idx];
		let e = entryInfo[code];
		document.body.appendChild(document.createTextNode(e.country + e.artist + e.song));
	}
}
{
	let btns = {};
	let save = function (autosaveBtn) {
		localStorage.setItem("escSort" + yr, saveCode = order.map(el => toCode[el]).join(""));
		try { history.replaceState(null, null, ".") } catch {}
		if (!autosave) autosaveBtn.style.display = "";
	}
	let toggleAutosave = function (btn, saveBtn) {
		autosave = !autosave;
		localStorage.setItem("autosave", autosave);
		if (autosave) {
			btn.className = "on";
			btn.setAttribute("title", "Autosave ON");
			saveBtn.style.display = "none";
		}
		else {
			btn.className = "";
			btn.setAttribute("title", "Autosave OFF");
			saveBtn.style.display = "";
		}
	}
	let shareList = function () {
		saveCode = order.map(el => toCode[el]).join("");
		try { history.replaceState(null, null, ".?" + saveCode) } catch {}
	}
	function createButton(id, tooltip, action, ...args) {
		var btn = document.createElement("PRETTY-BUTTON");
		btn.id = id;
		btn.setAttribute("title", tooltip);
		btn.onclick = args ? (() => {action(...args.map(el => btns[el]))}) : action;
		document.getElementsByTagName("button-container")[0].appendChild(btn);
		return btn;
	}
	function showTable() {
		initTable();
		createRows();
		createDOMs();
		document.body.appendChild(table);
	}
	var table = document.createElement("TABLE");
	function init() {
		defaultOrder();
		showTable();
		btns.save = createButton("save", "Save", save, "as");
		btns.as = createButton("autosave", autosave ? "Autosave ON" : "Autosave OFF", toggleAutosave, "as", "save");
		btns.as.className = autosave ? "on" : "";
		btns.share = createButton("share", "Get share link\r\nin the title bar", shareList);
		if (autosave) btns.save.style.display = "none";
		else if (sharedLink) btns.as.style.display = "none";
		document.getElementsByTagName("button-container")[0].appendChild(document.createElement("HINT")).id = "second-hint";
		{
			let selectSeq = false;
			let ranks = document.getElementsByClassName("rank");
			let indexOf = function(arr, elem) {
				for (var idx in arr) {
					if (arr[idx] == elem) return parseInt(idx);
				}
				return -1;
			}
			let selectedNow = undefined;
			let clickSeq = function() {
				window.getSelection().removeAllRanges();
				if (!selectSeq) {
					selectSeq = true;
					selectedNow = this;
					for (let rank of ranks) {
						if (rank != this) rank.className = "rank selectable";
						else rank.className = "rank selected";
					}
				}
				else {
					for (let rank of ranks) rank.className = "rank";
					selectSeq = false;
					if (selectedNow === this) return;
					let no = indexOf(ranks, selectedNow);
					let ns = indexOf(ranks, this);
					let no_ = no == Math.min(no, ns);
					selectedNow = undefined;
					let step = x => (x + 1);
					if (!no_) step = x => (x - 1);
					let aux = order[no];
					let idx = no;
					for (idx = no; idx != ns; idx = step(idx)) {
						appendCells(idx, order[step(idx)]);
						order[idx] = order[step(idx)];
					}
					appendCells(ns, aux);
					order[ns] = aux;
					if (autosave) save();
					else try { history.replaceState(null, null, ".") } catch {}
				}
			}
			for (let rank of ranks) {
				rank.onclick = clickSeq;
			}
		}
	}
}
document.addEventListener("DOMContentLoaded", init, false);
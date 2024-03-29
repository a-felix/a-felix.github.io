﻿var order = [], dom = {}, noOfEntries = 0, entryInfo = {}, tableRows = [], saveCode = null, sharedLink = false, autosave = JSON.parse(localStorage.getItem("escSortAutosave")), theme = localStorage.getItem("escSortTheme"), yr, codeset, codesetSet = false;
if (autosave === null) autosave = true;
switch (theme) {
	case "dark": theme = "dark"; document.documentElement.classList.add("dark-theme"); break;
	default: theme = "light";
}
var toCode = {
	eu: { at: "A", be: "B", cz: "C", de: "D", es: "E", fr: "F", gb: "G", hu: "H", it: "I", is: "J", kz: "K", lu: "L", mt: "M", no: "N", au: "O", pt: "P", mk: "Q", ro: "R", se: "S", tr: "T", ua: "U", si: "V", wa: "W", hr: "X", yu: "Y", az: "Z", am: "a", bg: "b", cy: "c", dk: "d", ee: "e", fi: "f", gr: "g", ch: "h", il: "i", ie: "j", ks: "k", lv: "l", me: "m", nl: "n", md: "o", pl: "p", al: "q", ru: "r", rs: "s", lt: "t", us: "u", sk: "v", mc: "w", ah: "x", by: "y", ba: "z", ma: "0", li: "1", ad: "2", lb: "3", ps: "4", sm: "5", ge: "6", ts: "7", fo: "8", aa: "9", cs: "+", ab: "-", kk: "*", eh: "/", ca: "^", os: "_", ax: "@", ce: "=" },
	us: { oh: "I", al: "B", in: "n", gu: "6", hi: "H", ut: "U", ia: "a", ak: "k", ks: "K", tn: "T", ms: "p", nv: "N", id: "d", me: "e", tx: "X", ar: "A", mt: "M", or: "O", il: "l", co: "C", de: "E", ga: "G", va: "V", ok: "o", az: "Z", wi: "W", mo: "m", ne: "b", mi: "c", fl: "F", md: "r", la: "L", ct: "t", ky: "y", nj: "J", ny: "w", vt: "v", wy: "Y", ma: "u", ca: "f", nd: "8", sd: "S", mn: "i", nm: "x", pr: "Q", as: "5", nc: "z", pa: "P", wa: "2", ri: "R", vi: "j", wv: "g", nh: "h", dc: "D", sc: "s", mp: "q" },
	ca: { on: "O", qc: "Q", ns: "s", nb: "b", mb: "M", bc: "B", pe: "P", sk: "S", ab: "A", nl: "L", nt: "T", yt: "Y", nu: "N" }
};
var fromCode = {};
{
	let addEntry = function (code, show, country, artist, song, note) {
		if (!codesetSet) {
			toCode = toCode[codeset ?? "eu"];
			for (let idx in toCode) { fromCode[toCode[idx]] = idx }
			codesetSet = true;
		}
		entryInfo[code] = {"country": country, "show": show, "artist": artist, "song": song};
		if (typeof note !== "undefined") entryInfo[code].note = note;
		noOfEntries++;
	}
	window.defineEntries(addEntry);
	window.defineEntries = undefined;
	delete window.defineEntries;
}
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
	var countryStr;
	switch (codeset) {
		case "us": countryStr = "State/Territory"; break;
		case "ca": countryStr = "Province/Territory"; break;
		default: countryStr = "Country"; break;
	}
	var headers = ["Rank", countryStr, "Artist", "Song"];
	var headerRow = document.createElement("TR");
	for (var h of headers) headerRow.appendChild(document.createElement("TH")).appendChild(document.createTextNode(h));
	table.appendChild(headerRow);
}
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
		row.appendChild(rankCell);
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
		flag.src = "../../flags/" + (codeset ?? "eu") + "/" + code + ".png";
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
	let changed = false;
	let unsavedPrompt = function(e) {
		console.log(e);
		return "You have unsaved changes.\r\nDo you want to leave anyway?";
	}
	let btns = {};
	let save = function (autosaveBtn) {
		localStorage.setItem("escSort" + yr, saveCode = order.map(el => toCode[el]).join(""));
		changed = false;
		document.body.onbeforeunload = undefined;
		try { history.replaceState(null, null, ".") } catch {}
	}
	let savePrompt = function (autosaveBtn) {
		if (changed && !confirm("Confirm save?")) return;
		save(autosaveBtn);
		autosaveBtn.style.display = "";
	}
	let toggleAutosave = function (btn, saveBtn) {
		if (!autosave && changed && !confirm("Confirm changes and enable autosaving?")) return;
		autosave = !autosave;
		localStorage.setItem("escSortAutosave", autosave);
		if (autosave) {
			if (changed) save(btn);
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
	let toggleTheme = function (btn, themeBtn) {
		theme = (theme == "light") ? "dark" : "light";
		localStorage.setItem("escSortTheme", theme);
		if (theme == "light") document.documentElement.classList.remove("dark-theme");
		else document.documentElement.classList.add("dark-theme");
	}
	let backToYrSel = function () {
		try { history.replaceState(null, null, ".") }
		catch {}
		finally { document.location.href += "../../" }
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
		btns.save = createButton("save", "Save", savePrompt, "as");
		btns.as = createButton("autosave", autosave ? "Autosave ON" : "Autosave OFF", toggleAutosave, "as", "save");
		btns.as.className = autosave ? "on" : "";
		createButton("back", "Back to year selection", backToYrSel);
		btns.share = createButton("share", "Get share link\r\nin the title bar", shareList);
		btns.theme = createButton("theme", "Toggle light/dark mode", toggleTheme);
		if (autosave) btns.save.style.display = "none";
		else if (sharedLink) btns.as.style.display = "none";
		{
			let secondHint = document.createElement("HINT");
			secondHint.id = "second-hint";
			document.getElementsByTagName("button-container")[0].appendChild(secondHint);
			secondHint.addEventListener("click", e => {
				window.open("../../apache-license-content.html", "_blank");
			});
		}
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
					else {
						changed = true;
						document.body.onbeforeunload = unsavedPrompt;
						try { history.replaceState(null, null, ".") } catch {}
					}
				}
			}
			for (let rank of ranks) {
				rank.onclick = clickSeq;
			}
		}
	}
}
document.addEventListener("DOMContentLoaded", init, false);
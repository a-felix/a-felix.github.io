var order = [], dom = {}, tableRows = [];
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
	if (localStorage.getItem("escSortYr") == yr) {
		var savedOrder = localStorage.getItem("escSort");
		if (savedOrder) {
			savedOrder = JSON.parse(savedOrder);
			if (savedOrder.length) {
				order = savedOrder;
				verifyOrder();
				return;
			}
		}
	}
	for (var code in entryInfo) order.push(code);
	//order = ["nl", "it", "mt", "az", "se", "rs", "ch", "dk", "mk", "ro", "fr", "hu", "il", "cz", "cy", "al", "ee", "sm", "lv", "si", "gr", "lt", "es", "am", "be", "no", "pt", "ru", "is", "gb", "ge", "md", "me", "by", "at", "fi", "de", "au", "ie", "hr", "pl"];
	//order = order.sort(() => (Math.random() - 0.5));
}
function initTable() {
	var headers = ["Rank", "Change", "Country", "Artist", "Song"];
	var headerRow = document.createElement("TR");
	for (var h of headers) headerRow.appendChild(document.createElement("TH")).appendChild(document.createTextNode(h));
	table.appendChild(headerRow);
}
{
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
		row.appendChild(rankCell);
		row.appendChild(switchCell);
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
function toggleDisplay() {
	if (document.body.className) document.body.className = "";
	else document.body.className = "display";
}
function createToggleButton() {
	var btn = document.createElement("TOGGLE-BUTTON");
	btn.id = "zoom";
	btn.onclick = toggleDisplay;
	document.body.appendChild(btn);
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
	createToggleButton();
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
				localStorage.setItem("escSort", JSON.stringify(order));
				localStorage.setItem("escSortYr", yr);
			}
		}
		for (let rank of ranks) {
			rank.onclick = clickSeq;
		}
	}
}
document.addEventListener("DOMContentLoaded", init, false);
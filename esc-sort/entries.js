var entryInfo = {}, noOfEntries = 0, yr = 2019;
{
	let addEntry = function (code, show, country, artist, song, note) {
		entryInfo[code] = {"country": country, "show": show, "artist": artist, "song": song};
		if (typeof note !== "undefined") entryInfo[code].note = note;
		noOfEntries++;
	}
	let removeEntry = function (code) {
		delete entryInfo[code];
	}
	let defineEntries = function () {
		addEntry("al", 2, "Albania", "Jonida Maliqi", "Ktheju tokës", "Return to the land");
		addEntry("am", 2, "Armenia", "Srbuk", "Walking Out");
		addEntry("au", 1, "Australia", "Kate Miller-Heidke", "Zero Gravity");
		addEntry("at", 2, "Austria", "PÆNDA", "Limits");
		addEntry("az", 2, "Azerbaijan", "Chingiz", "Truth");
		addEntry("by", 1, "Belarus", "ZENA", "Like It");
		addEntry("be", 1, "Belgium", "Eliot", "Wake Up");
		addEntry("hr", 2, "Croatia", "Roko", "The Dream");
		addEntry("cy", 1, "Cyprus", "Tamta", "Replay");
		addEntry("cz", 1, "Czech Republic", "Lake Malawi", "Friend of a Friend");
		addEntry("dk", 2, "Denmark", "Leonora", "Love Is Forever");
		addEntry("ee", 1, "Estonia", "Victor Crone", "Storm");
		addEntry("fi", 1, "Finland", "Darude feat. Sebastian Rejman", "Look Away");
		addEntry("fr", 0, "France", "Bilal Hassani", "Roi", "King");
		addEntry("ge", 1, "Georgia", "Oto Nemsadze", "Sul tsin iare", "\"სულ წინ იარე\"; Go ahead");
		addEntry("de", 0, "Germany", "S!sters", "Sister");
		addEntry("gr", 1, "Greece", "Katerine Duska", "Better Love");
		addEntry("hu", 1, "Hungary", "Joci Pápai", "Az én apám", "My father");
		addEntry("is", 1, "Iceland", "Hatari", "Hatrið mun sigra", "Hate will prevail");
		addEntry("ie", 2, "Ireland", "Sarah McTernan", "22");
		addEntry("il", 0, "Israel", "Kobi Marimi", "Home");
		addEntry("it", 0, "Italy", "Mahmood", "Soldi", "Money");
		addEntry("lv", 2, "Latvia", "Carousel", "That Night");
		addEntry("lt", 2, "Lithuania", "Jurij Veklenko", "Run With the Lions");
		addEntry("mt", 2, "Malta", "Michela", "Chameleon");
		addEntry("md", 2, "Moldova", "Anna Odobescu", "Stay");
		addEntry("me", 1, "Montenegro", "D mol", "Heaven");
		addEntry("nl", 2, "Netherlands", "Duncan Laurence", "Arcade");
		addEntry("mk", 2, "North Macedonia", "Tamara Todevska", "Proud");
		addEntry("no", 2, "Norway", "KEiiNO", "Spirit in the Sky");
		addEntry("pl", 1, "Poland", "Tulia", "Fire of Love (Pali się)", "Fire of love (It's on fire)");
		addEntry("pt", 1, "Portugal", "Conan Osíris", "Telemóveis", "Cellphones");
		addEntry("ro", 2, "Romania", "Ester Peony", "On a Sunday");
		addEntry("ru", 2, "Russia", "Sergey Lazarev", "Scream");
		addEntry("sm", 1, "San Marino", "Serhat", "Say Na Na Na");
		addEntry("rs", 1, "Serbia", "Nevena Božović", "Kruna", "\"Круна\"; Crown");
		addEntry("si", 1, "Slovenia", "Zala Kralj & Gašper Šantl", "Sebi", "Oneself");
		addEntry("es", 0, "Spain", "Miki", "La venda", "The blindfold");
		addEntry("se", 2, "Sweden", "John Lundvik", "Too Late for Love");
		addEntry("ch", 2, "Switzerland", "Luca Hänni", "She Got Me");
		addEntry("gb", 0, "United Kingdom", "Michael Rice", "Bigger than Us");
	}
	defineEntries();
}
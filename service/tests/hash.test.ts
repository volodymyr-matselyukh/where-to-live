const bcrypt = require('bcrypt');

test('test hashing', async () => {

	const stringToHash = `Do wynajęcia od 1 października 3 pok. mieszkanie (62m2) z dużym tarasem; Wrocław,-
	Kozanów;
	- mieszkanie w pełni umeblowane, bardzo słoneczne, wszystkie pokoje od południa, z pięknym widokiem na park,
	- jasna kuchnia (lodówka, zmywarka, piekarnik el, płyta gaz, okap]
	- łazienka z pralką, osobne wc po remoncie w 2020,
	- duży taras wyłożony podestem tarasowym,
	- bardzo dobre skomunikowane: tramwaje (12,18,19,21) i autobusy (102, 103, 104, 126,127, C),
	- dogodny dojazd do AOW i obwodnicy śródmiejskiej,
	- stacja rowerów miejskich,
	- duży parking zewnętrzny,
	- w pobliżu parki (Zachodni i Pilczycki), sklepy (m.in. Biedronka), obiekty sportowe (baseny, lodowisko i siłownia w hali Orbita, klub sportowy K69), obiekty edukacyjne (szkoły, przedszkola i żłobki), klub Anima, Stadion Miejski
	- opłaty: najem 3100 zł + ok.680 zl czynsz do spółdzielni (w zależności od ilości osób)+ woda i prąd wg zużycia
	- świadectwo energetyczne mieszkania: SCHE/22132/2415/2023`;

	const hashingResult = await bcrypt.hash(stringToHash, 0);

	const areEqual = await bcrypt.compare(stringToHash, hashingResult);
	
	expect(areEqual).toBe(true);
});
import { AppartmentDataRecognizer } from "./AppartmentDataRecognizer";
import { OlxScrapper } from './scrappers/olxScrapper';
import Place, {DataProviderType} from './db/Place';
import GoogleMaps from "./GoogleMaps";
import { GeoLocation } from "./models/GoogleMapsResponse";
import { Scrapper } from "./scrappers/iScrapper";
const bcrypt = require('bcrypt');

require('dotenv').config();
const mongoose = require('mongoose');

const connectionUri = `mongodb+srv://volodymyrmatselyukh:${process.env.MONGO_ATLAS_PW}@wheretolive.dckqi80.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(connectionUri, { 
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const Country = 'Poland';

const main = async () => {
	// const address = await GetPlaceAddress(`Do wynajęcia od 1 października 3 pok. mieszkanie (62m2) z dużym tarasem; Wrocław,-
	// Kozanów;
	// - mieszkanie w pełni umeblowane, bardzo słoneczne, wszystkie pokoje od południa, z pięknym widokiem na park,
	// - jasna kuchnia (lodówka, zmywarka, piekarnik el, płyta gaz, okap]
	// - łazienka z pralką, osobne wc po remoncie w 2020,
	// - duży taras wyłożony podestem tarasowym,
	// - bardzo dobre skomunikowane: tramwaje (12,18,19,21) i autobusy (102, 103, 104, 126,127, C),
	// - dogodny dojazd do AOW i obwodnicy śródmiejskiej,
	// - stacja rowerów miejskich,
	// - duży parking zewnętrzny,
	// - w pobliżu parki (Zachodni i Pilczycki), sklepy (m.in. Biedronka), obiekty sportowe (baseny, lodowisko i siłownia w hali Orbita, klub sportowy K69), obiekty edukacyjne (szkoły, przedszkola i żłobki), klub Anima, Stadion Miejski
	// - opłaty: najem 3100 zł + ok.680 zl czynsz do spółdzielni (w zależności od ilości osób)+ woda i prąd wg zużycia
	// - świadectwo energetyczne mieszkania: SCHE/22132/2415/2023`, `ul. Kolista, Kozanów, Fabryczna, Wrocław, dolnośląskie`);
	
	// ProcessPlace(address);

	// const olxScrapper = new OlxScrapper();

	// const city = 'Lublin';

	// const numberOfPages = 1;//olxScrapper.getNumberOfPages(city);
	
	// let allLinks: string [] = [];

	// for(let i = 1; i <= numberOfPages; i++)
	// {
	// 	const linksFromPage = olxScrapper.getApartmentUrls(city, i);
	// 	allLinks = [...allLinks, ...linksFromPage];
	// }
	
	// allLinks = allLinks.filter(link => link.startsWith("https://www.olx.pl"));

	// const url = "https://www.olx.pl/d/oferta/wynajme-mieszkanie-2-pokoje-CID3-IDVomsp.html";

	// const apartmentText = await olxScrapper.getApartmentTextAsync(url);

	// console.log("text for analysis", apartmentText.fullText);

	// const hashingResult = await bcrypt.hash(apartmentText.fullText, 0);

	// const dataRecognizer = new AppartmentDataRecognizer();

	// const recognizedData = await dataRecognizer.GetPlaceAddress(apartmentText.fullText, city);

	// const provider: DataProviderType = "Olx";

	// let geoLocation: GeoLocation | null = null;

	// if(recognizedData.address)
	// {
	// 	const googleMaps = new GoogleMaps();
	// 	geoLocation = await googleMaps.GetGeoCoordinatesAsync(`${city} ${recognizedData.address}`);
	// }
	// else{
	// 	console.error("No address recognized");
	// 	return;
	// }

	// const newPlace = new Place({
	// 	contentHash: hashingResult,
	// 	name: apartmentText.title,
	// 	url: url,
	// 	dataProvider: provider,
	// 	location: recognizedData.address,
	// 	attributes: {
	// 		area: recognizedData.area,
	// 		floorNumber: recognizedData.floor,
	// 		roomsCount: recognizedData.roomsCount,
	// 		totalFloors: recognizedData.totalFloors
	// 	},
	// 	price: {
	// 		rentPrice: apartmentText.price || recognizedData.rentPrice,
	// 		insurancePrice: recognizedData.insurancePrice,
	// 		mediaPrice: recognizedData.mediaPrice
	// 	},
	// 	images: {
	// 		listImageUrl: apartmentText.image
	// 	},
	// 	geoLocation: {
	// 		type: "Point",
	// 		coordinates: [geoLocation.lng, geoLocation.lat]
	// 	}
	// });

	// console.log("newPlace", newPlace);


	await scrapeAsync('Lublin', 'Olx', 10);
}

const scrapeAsync = async (city: string, type: "Olx", itemsLimit: number = 0) => {
	const olxScrapper = new OlxScrapper();

	const linksToScrape = await getLinksToScrapeAsync(olxScrapper, city, itemsLimit);
	
	linksToScrape.forEach(async (link) => {
		await scrapeByLinkAsync(link, olxScrapper, city);
	}); 
}

const getLinksToScrapeAsync = async (scrapper: Scrapper, city: string, itemsLimit: number = 0): Promise<string []> => {
	const numberOfPages = await scrapper.getNumberOfPagesAsync(city);
	
	let allLinks: string [] = [];
	let linksOfType: string [] = [];

	for(let i = 1; i <= numberOfPages; i++)
	{
		const linksFromPage = await scrapper.getApartmentUrlsAsync(city, i);
		allLinks = [...allLinks, ...linksFromPage];

		linksOfType = getLinksOfType('Olx', allLinks);

		if(itemsLimit !== 0 && linksOfType.length >= itemsLimit)
		{
			break;
		}
	}

	return linksOfType.slice(0, itemsLimit);
}

const getLinksOfType = (type: string, links: string[]): string [] => {
	switch(type){
		case 'Olx':
			return links.filter(link => link.startsWith("https://www.olx.pl"));
	}

	return [];
}

const scrapeByLinkAsync = async (link: string, scrapper: Scrapper, city: string) => {
	
	const apartmentText = await scrapper.getApartmentTextAsync(link);

	console.log("text for analysis", apartmentText.fullText);

	const hashingResult = await bcrypt.hash(apartmentText.fullText, 0);

	const existingPlace = await Place.findOne({url: link}).exec();

	let shouldUpdate = false;

	if(existingPlace)
	{
		console.log("place already exists");

		if(await bcrypt.compare(apartmentText.fullText, existingPlace.contentHash))
		{
			console.log("place wasn't change. skipping...");
			return;
		}
		else
		{
			console.log("place has been changed.");
			shouldUpdate = true;
		}
	}

	const dataRecognizer = new AppartmentDataRecognizer();

	const recognizedData = await dataRecognizer.GetPlaceAddress(apartmentText.fullText, city);

	const provider: DataProviderType = "Olx";

	let geoLocation: GeoLocation | null = null;

	if(recognizedData.address)
	{
		const googleMaps = new GoogleMaps();
		geoLocation = await googleMaps.GetGeoCoordinatesAsync(`${city} ${recognizedData.address}`);
	}
	else{
		console.error("No address recognized");
		return;
	}

	const newPlacePlain = {
		contentHash: hashingResult,
		name: apartmentText.title,
		url: link,
		dataProvider: provider,
		location: {
			address: recognizedData.address,
			city,
			country: Country
		},
		attributes: {
			area: recognizedData.area,
			floorNumber: recognizedData.floor,
			roomsCount: recognizedData.roomsCount,
			totalFloors: recognizedData.totalFloors
		},
		price: {
			rentPrice: apartmentText.price || recognizedData.rentPrice,
			insurancePrice: recognizedData.insurancePrice,
			mediaPrice: recognizedData.mediaPrice
		},
		images: {
			listImageUrl: apartmentText.image
		},
		geoLocation: {
			type: "Point",
			coordinates: [geoLocation.lng, geoLocation.lat]
		}
	};

	if(shouldUpdate)
	{
		await updatePlaceAsync(existingPlace!._id, newPlacePlain);
	}
	else
	{
		await addPlaceAsync(newPlacePlain);
	}
}

const updatePlaceAsync = async (existingPlaceId: any, place: any) => {
	try
	{
		await Place.updateOne({_id: existingPlaceId}, 
			(place)
		).exec();
	}
	catch(err)
	{
		console.error("Error updating", err);
	}
}

const addPlaceAsync = async (place: any) => {
	try{
		await new Place(place).save();
		console.log("newPlace", place);
	}
	catch(err)
	{
		console.error("Error adding place", err);
	}
}

main();

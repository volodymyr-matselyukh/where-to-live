import { AppartmentDataRecognizer } from "./AppartmentDataRecognizer";
import { getScrapper } from './scrappers/scrapperFactory';
import Place from './db/Place';
import GoogleMaps from "./GoogleMaps";
import { GeoLocation } from "./models/GoogleMapsResponse";
import { Scrapper } from "./scrappers/iScrapper";
import { ScrapperType } from "./models/ScrapperTypeEnum";
import { ScrappedApartmentDetails } from "./models/ScrappedApartmentDetails";
const bcrypt = require('bcrypt');

require('dotenv').config();
const mongoose = require('mongoose');

const connectionUri = `mongodb+srv://volodymyrmatselyukh:${process.env.MONGO_ATLAS_PW}@wheretolive.dckqi80.mongodb.net/realestate?retryWrites=true&w=majority`;

mongoose.connect(connectionUri, { 
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const Country = 'Poland';

const dataRecognizer = new AppartmentDataRecognizer();

const main = async () => {
	await scrapeAsync('Lublin', 'Olx', 20);
}

const scrapeAsync = async (city: string, type: ScrapperType, itemsLimit: number = 0) => {
	const scrapper = getScrapper(type);

	const linksToScrape = await getLinksToScrapeAsync(scrapper, city, itemsLimit);
	
	const promises: Promise<void>[] = [];

	linksToScrape.forEach(async (link) => {
		promises.push(scrapeByLinkAsync(link, scrapper, city));
	});

	Promise.all(promises);
}

const getLinksToScrapeAsync = async (scrapper: Scrapper, city: string, itemsLimit: number = 0): Promise<string []> => {
	const numberOfPages = await scrapper.getNumberOfPagesAsync(city);
	
	let allLinks: string [] = [];
	let linksOfType: string [] = [];

	for(let i = 1; i <= numberOfPages; i++)
	{
		const linksFromPage = await scrapper.getApartmentUrlsAsync(city, i);
		allLinks = [...allLinks, ...linksFromPage];

		linksOfType = getLinksOfType(scrapper.Type, allLinks);

		if(itemsLimit !== 0 && linksOfType.length >= itemsLimit)
		{
			break;
		}
	}

	return linksOfType.slice(0, itemsLimit);
}

const getLinksOfType = (type: ScrapperType, links: string[]): string [] => {
	switch(type){
		case 'Olx':
			return links.filter(link => link.startsWith("https://www.olx.pl"));
		default:
			throw new Error("Type is unknown");
	}
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

	const newPlacePlain = await getDbObjectAsync(hashingResult, apartmentText, scrapper, link, city);

	if(shouldUpdate)
	{
		await updatePlaceAsync(existingPlace!._id, newPlacePlain);
	}
	else
	{
		await addPlaceAsync(newPlacePlain);
	}
}

const getDbObjectAsync = async (hashingResult: string, apartmentDetails: ScrappedApartmentDetails,
	scrapper: Scrapper, link: string, city: string) => {
	const recognizedData = await dataRecognizer.GetPlaceAddress(apartmentDetails.fullText, city);

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
		name: apartmentDetails.title,
		url: link,
		dataProvider: scrapper.Type,
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
			rentPrice: apartmentDetails.price || recognizedData.rentPrice,
			insurancePrice: recognizedData.insurancePrice,
			mediaPrice: recognizedData.mediaPrice
		},
		images: {
			listImageUrl: apartmentDetails.image
		},
		geoLocation: {
			type: "Point",
			coordinates: [geoLocation.lng, geoLocation.lat]
		}
	};

	return newPlacePlain;
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

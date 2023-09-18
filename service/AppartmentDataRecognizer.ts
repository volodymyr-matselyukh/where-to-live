import axios from 'axios'
import { GeocodeResponse } from './models/GoogleMapsResponse';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const ProcessPlace = async (address: string) => {
	const encodedAddress = encodeURI(address);

	const googleApiKey = process.env.GOOGLE_API_KEY;

	console.log("api key", googleApiKey);

	const googleMapsApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleApiKey}`;

	const response = await axios.get<GeocodeResponse>(googleMapsApiUrl).then(response => response.data);
	console.log(response.results[0].geometry.location);
}

export const GetPlaceAddress = async (textForAnalyzing: string, city: string) => {
	const separator = "$%";
	const textTemplate = 
		`read the text below and return recognized data in format: 
		city${separator}
		dzielnica${separator}
		osiedle${separator}
		adres${separator}
		piętro${separator}
		łączna liczba pięter${separator}
		czynsz${separator}
		cena najmu${separator}
		kaucija${separator}
		powierzchnia${separator}
		liczba pokoi${separator}
		building number. 
		
		Use these symbols ${separator} as separator.
		If can't recognize some property put none. 
		Put city ${city} if nothing else found.
		Text for analyzing: ${textForAnalyzing}`;

	const completion = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [{role:"user", content: textTemplate}]
	});

	const message = completion.choices[0].message.content || "";

	const messageParts = message.split(separator);

	console.log(message);

	return messageParts.filter(part => part != "none") .join(" ");

	//console.log(completion.choices[0].message);

	//return message;
}
import axios from 'axios'
import { GeocodeResponse } from './models/GoogleMapsResponse';
import { RecognizedApartmentDetails } from './models/RecognizedApartmentDetails';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export class AppartmentDataRecognizer {
	ProcessPlace = async (address: string) => {
		const encodedAddress = encodeURI(address);
	
		const googleApiKey = process.env.GOOGLE_API_KEY;
	
		console.log("api key", googleApiKey);
	
		const googleMapsApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleApiKey}`;
	
		const response = await axios.get<GeocodeResponse>(googleMapsApiUrl).then(response => response.data);
		console.log(response.results[0].geometry.location);
	}
	
	GetPlaceAddress = async (textForAnalyzing: string, city: string) => {
		const textTemplate = 
			`read the text below and return recognized data in JSON format: 
			{ 
				"city": city,
			  	"address": address,
			  	"floor": piętro as integer,
			  	"totalFloors": łączna liczba pięter,
			  	"mediaPrice": czynsz as integer,
			  	"rentPrice": cena najmu as integer,
				"insurancePrice": kaucija as integer,
				"area": powierzchnia as integer,
				"roomsCount": liczba pokoi as integer
			}
			
			Put recognized data under the respective key.
			Put none if property value wasn't recognized. 
			Put city ${city} if nothing else found.
			Text for analyzing: ${textForAnalyzing}`;
	
		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [{role:"user", content: textTemplate}]
		});
	
		const message = completion.choices[0].message.content || "";
	
		const recognizedObject: RecognizedApartmentDetails = JSON.parse(message);

		console.log("message", message);
		console.log("recognized object", recognizedObject);
	
		return message;
	
		//console.log(completion.choices[0].message);
	
		//return message;
	}
}

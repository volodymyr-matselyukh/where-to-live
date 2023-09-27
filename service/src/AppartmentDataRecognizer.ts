import { RecognizedApartmentDetails } from './models/RecognizedApartmentDetails';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export class AppartmentDataRecognizer {
	GetPlaceAddress = async (textForAnalyzing: string, city: string): Promise<RecognizedApartmentDetails> => {
		const textTemplate = 
			`read the text below and return recognized data in JSON format: 
			{ 
				"city": city,
			  	"address": adres mieszkania,
			  	"floor": piętro as integer,
			  	"totalFloors": łączna liczba pięter,
			  	"mediaPrice": czynsz administracyjny as integer,
			  	"rentPrice": cena najmu as integer,
				"insurancePrice": kaucija as integer,
				"area": powierzchnia as integer,
				"roomsCount": liczba pokoi as integer
			}
			
			Put recognized data under the respective key.
			Put null if property value wasn't recognized.
			Please contentrate on address recognition.
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
	
		return recognizedObject;
	
		//console.log(completion.choices[0].message);
	
		//return message;
	}
}

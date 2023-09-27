import axios from "axios";
import { GeoLocation, GeocodeResponse } from "./models/GoogleMapsResponse";

export default class GoogleMaps {

	GetGeoCoordinatesAsync = async (address: string): Promise<GeoLocation> => {
		const encodedAddress = encodeURI(address);

		const googleApiKey = process.env.GOOGLE_API_KEY;

		console.log("api key", googleApiKey);

		const googleMapsApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleApiKey}`;

		const response = await axios.get<GeocodeResponse>(googleMapsApiUrl).then(response => response.data);
		console.log(response.results[0].geometry.location);

		return response.results[0].geometry.location;
	}
}
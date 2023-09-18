import { ApartmentDetails } from "../models/ApartmentDetails";

export interface Scrapper {
	getApartmentText: (url: string) => Promise<ApartmentDetails>,
	getApartmentUrls: (city: string, page: number) => string[],
	getNumberOfPages: (city: string) => number
}
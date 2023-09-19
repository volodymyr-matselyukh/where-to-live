import { ScrappedApartmentDetails } from "../models/ScrappedApartmentDetails";

export interface Scrapper {
	getApartmentText: (url: string) => Promise<ScrappedApartmentDetails>,
	getApartmentUrls: (city: string, page: number) => string[],
	getNumberOfPages: (city: string) => number
}
import { ScrappedApartmentDetails } from "../models/ScrappedApartmentDetails";

export interface Scrapper {
	getApartmentTextAsync: (url: string) => Promise<ScrappedApartmentDetails>,
	getApartmentUrlsAsync: (city: string, page: number) => Promise<string[]>,
	getNumberOfPagesAsync: (city: string) => Promise<number>
}
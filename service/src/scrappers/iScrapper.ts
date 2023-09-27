import { ScrappedApartmentDetails } from "../models/ScrappedApartmentDetails";
import { ScrapperType } from "../models/ScrapperTypeEnum";

export interface Scrapper {
	get Type(): ScrapperType;
	getApartmentTextAsync: (url: string) => Promise<ScrappedApartmentDetails>,
	getApartmentUrlsAsync: (city: string, page: number) => Promise<string[]>,
	getNumberOfPagesAsync: (city: string) => Promise<number>
}
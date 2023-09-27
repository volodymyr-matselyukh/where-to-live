import { ScrapperType } from "../models/ScrapperTypeEnum";
import { OlxScrapper } from './olxScrapper';

export const getScrapper = (type: ScrapperType) => {
	switch(type){
		case "Olx":
			return new OlxScrapper();
		case "OtoDom":
			throw new Error("Not implemented");
		default:
			throw new Error("Argument exception");
	}
}
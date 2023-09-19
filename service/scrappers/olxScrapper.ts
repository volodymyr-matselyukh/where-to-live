import { Scrapper } from "./iScrapper";
import { ScrappedApartmentDetails } from '../models/ScrappedApartmentDetails';
import Xray from 'x-ray'

const scrapper = Xray();

export class OlxScrapper implements Scrapper {


	getApartmentText = async (url: string): Promise<ScrappedApartmentDetails> => {

		try {
			const result = await scrapper(url,
			{
				tags: ['[data-testid="main"] ul li p'],
				price: '[data-testid="ad-price-container"] h3',
				title: '[data-cy="ad_title"]',
				description: '[data-cy="ad_description"] div'
			});
			
			console.log("result", result);

			const concatenatedString = `${result.tags.join(' ')} ${result.price} ${result.title} ${result.description}`;

			return {
				title: result.title,
				price: result.price,
				fullText: concatenatedString
			};
		}
		catch (e) {
			console.error('error scrapping', e);
		}

		return {
			price: "",
			fullText: "",
			title: ""
		};
	}

	getApartmentUrls = (city: string, page: number) => {

		const url = `https://www.olx.pl/nieruchomosci/mieszkania/wynajem/${city}/q-mieszkanie-do-wynaj%C4%99cia/?page=${page}`;

		try {
			scrapper(url, ['div[data-testid="listing-grid"] div[data-cy="l-card"] a@href'])(function (err, result) {

				console.log("urls", result);

				return result;
			});
		}
		catch (e) {
			console.error('error scrapping', e);
		}

		return [];
	};

	getNumberOfPages = (city: string): number => {
		const url = `https://www.olx.pl/nieruchomosci/mieszkania/wynajem/${city}/q-mieszkanie-do-wynaj%C4%99cia/`;

		try {
			scrapper(url, 'div[data-testid="pagination-wrapper"]',
				'li:last-of-type[data-testid="pagination-list-item"] a')(function (err, result) {

					return parseInt(result);
				});
		}
		catch (e) {
			console.error('error scrapping', e);
		}

		return 0;
	};
}
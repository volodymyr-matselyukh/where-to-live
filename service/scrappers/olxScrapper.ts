import { Scrapper } from "./iScrapper";
import { ScrappedApartmentDetails } from '../models/ScrappedApartmentDetails';
import Xray from 'x-ray'

const scrapper = Xray();

export class OlxScrapper implements Scrapper {


	getApartmentTextAsync = async (url: string): Promise<ScrappedApartmentDetails> => {

		try {
			const result = await scrapper(url,
			{
				tags: ['[data-testid="main"] ul li p'],
				price: '[data-testid="ad-price-container"] h3',
				title: '[data-cy="ad_title"]',
				description: '[data-cy="ad_description"] div',
				image: '.swiper-zoom-container img@src'
			});
			
			console.log("result", result);

			const concatenatedString = `${result.tags.join(' ')} ${result.price} ${result.title} ${result.description}`;

			return {
				title: result.title,
				price: result.price,
				fullText: concatenatedString,
				image: result.image
			};
		}
		catch (e) {
			console.error('error scrapping', e);
		}

		return {
			price: "",
			fullText: "",
			title: "",
			image: ""
		};
	}

	getApartmentUrlsAsync = async (city: string, page: number): Promise<string[]> => {

		const url = `https://www.olx.pl/nieruchomosci/mieszkania/wynajem/${city}/q-mieszkanie-do-wynaj%C4%99cia/?page=${page}`;

		try {
			return await scrapper(url, ['div[data-testid="listing-grid"] div[data-cy="l-card"] a@href']);
		}
		catch (e) {
			console.error('error scrapping', e);
		}

		return [];
	};

	getNumberOfPagesAsync = async (city: string): Promise<number> => {
		const url = `https://www.olx.pl/nieruchomosci/mieszkania/wynajem/${city}/q-mieszkanie-do-wynaj%C4%99cia/`;

		try {
			const result = await scrapper(url, 'div[data-testid="pagination-wrapper"]',
				'li:last-of-type[data-testid="pagination-list-item"] a');

			return parseInt(result);
		}
		catch (e) {
			console.error('error scrapping', e);
		}

		return 0;
	};
}
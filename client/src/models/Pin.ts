import { ProviderType } from "./enums/ProviderTypeEnum";

export default interface Pin
{
	lat: number;
	lng: number;
		
	details: {
		name: string;
		imageUrl: string;
		link: string;
		price: string;
		media: string;
		insurancePrice: string;
		area: number;
		rooms: number;
		provider: ProviderType;
	}
}
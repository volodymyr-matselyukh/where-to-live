import { ProviderType } from "./enums/ProviderTypeEnum";

export default interface Pin
{
	lat: number;
	lng: number;
		
	details: {
		name: string;
		imageUrl: string;
		link: string;
		price: number;
		media: number;
		insurancePrice: number;
		area: number;
		rooms: number;
		provider: ProviderType;
	}
}
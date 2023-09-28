import { ProviderType } from "./enums/ProviderTypeEnum"

export interface PlaceDto {
	_id: string,

	location: {
		city: string,
		country: string,
		address: string
	},
	geoLocation: {
		coordinates: number[]
	},
	attributes: {
		area: number,
		roomsCount: number,
		floorNumber: string,
		totalFloors: number
	},
	images: {
		listImageUrl: string
	},
	price: {
		rentPrice: string,
		insurancePrice: string,
		mediaPrice: string
	},
	name: string,
	url: string,
	dataProvider: ProviderType,
}


import { Schema, model, models } from 'mongoose';

export type DataProviderType = "Olx" | "Otodom" | "Wrona";

const PlaceSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required!']		
	},
	description: {
		type: String,
	},
	url: {
		type: String,
		required: [true, "Url is required!"],
		unique: [true, "Url should be unique"]
	},
	location: {
		city: {
			type: String,
			required: [true, "City is required!"]
		},
		country: {
			type: String,
			required: [true, "Country is required"]
		},
		address: {
			type: String,
			required: [true, "Address is required"]
		}
	},
	geoLocation: {
		type: {
			type: String,
			enum: ['Point']
		},
		coordinates: {
			type: [Number]
		}
	},
	attributes: {
		area: {
			type: Number
		},
		roomsCount: {
			type: Number
		},
		floorNumber: {
			type: String
		},
		totalFloors: {
			type: Number
		}
	},
	contentHash:{
		type: String,
		required: [true, "Hash is required"]
	},
	images: {
		listImageUrl: {
			type: String
		}
	},
	price: {
		rentPrice: {
			type: String
		},
		insurancePrice: {
			type: String
		},
		mediaPrice: {
			type: String
		}
	},
	dataProvider: {
		type: String
	}
});

const Place = model("Place", PlaceSchema);

export default Place;
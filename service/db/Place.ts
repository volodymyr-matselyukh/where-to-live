import { Schema, model, models } from 'mongoose';

const PlaceSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required!']
	},
	description: {
		type: String,
		required: [true, 'Description is required!']
	},
	url: {
		type: String,
		required: [true, "Url is required!"]
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
		street: {
			type: String,
			required: [true, "Street is required"]
		},
		building: {
			type: String
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
	}
});

const Place = model("Place", PlaceSchema);

export default Place;
export interface GeocodeResponse {
	results: [
		{
			geometry: {
				location: GeoLocation
			}
		}
	]
}

export interface GeoLocation {
	lat: number,
	lng: number
}
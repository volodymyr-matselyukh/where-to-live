export interface GeocodeResponse {
	results: [
		{
			geometry: {
				location: {
					lat: string,
					lng: string
				}
			}
		}
	]
}
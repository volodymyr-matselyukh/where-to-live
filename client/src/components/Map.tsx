import usePlaceApi from "@/api/usePlaceApi";
import Pin from "@/models/Pin";
import { PlaceDto } from "@/models/Place";

export const Map = () => {

	const usePlaces = usePlaceApi();
	const { data: places } = usePlaces.list;

	const placesToPins = (places: PlaceDto[] | undefined): Pin[] | undefined => {
		
		return places && places.map(place => ({
			
			lat: place.geoLocation.coordinates[1],
			lng: place.geoLocation.coordinates[0],
				
			details: {
				name: place.name,
				imageUrl: place.images?.listImageUrl,
				link: place.url,
				price: place.price.rentPrice,
				media: place.price.mediaPrice,
				insurancePrice: place.price.insurancePrice,
				area: place.attributes.area,
				rooms: place.attributes.roomsCount,
				provider: place.dataProvider
			}
		}));
	}

	const pins: Pin[] | undefined = placesToPins(places);

	return (
		<>
			<h1>Map here</h1>

			{pins?.map(pin => (
				<>
					<div>{pin.details.name}</div>
					<img src={pin.details.imageUrl} alt="img" />
				</>
			))}
		</>
	);
}
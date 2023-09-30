import usePlaceApi from "@/api/usePlaceApi";
import Pin from "@/models/Pin";
import { PlaceDto } from "@/models/Place";
import {
	GoogleMap,
	MarkerF,
	useLoadScript,
	InfoWindowF,
} from "@react-google-maps/api";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";

export const Map = () => {
	const usePlaces = usePlaceApi();
	const { data: places } = usePlaces.list;
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
	});

	const [selectedMarkerUrl, setSelectedMarker] = useState("");
	const [center, setCenter] = useState({
		lat: 51.2465,
		lng: 22.5684,
	});

	const mapRef = useRef<GoogleMap | null>(null);

	const [map, setMap] = useState<google.maps.Map | null>(null);

	const onLoad = useCallback(function callback(map: google.maps.Map) {
		setMap(map)
	}, [])

	const onUnmount = useCallback(function callback(map: google.maps.Map) {
		setMap(null)
	}, [])

	const placesToPins = (
		places: PlaceDto[] | undefined
	): Pin[] | undefined => {
		return (
			places &&
			places.map((place) => ({
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
					provider: place.dataProvider,
				},
			}))
		);
	};

	const pins: Pin[] | undefined = placesToPins(places);

	const handleMarkerMouseOver = (pin: Pin) => {
		setSelectedMarker(pin.details.link);
	};

	const handleMarkerMouseOut = () => {
		setSelectedMarker("");
	};

	const getIcon = (pin: Pin) => {
		if (selectedMarkerUrl === pin.details.link) {
			return "/images/selected-pin.svg";
		} else {
			return "/images/map-pin-svgrepo-com.svg";
		}
	};

	const getGoogleMap = (): ReactNode => {
		return (
			<GoogleMap
				ref={mapRef}
				zoom={12}
				center={center}
				mapContainerClassName="map"
				mapContainerStyle={{
					width: "80%",
					height: "600px",
					margin: "auto",
				}}
				onLoad={onLoad}
				onBoundsChanged={() => console.log("bounds", map?.getBounds())}
				onClick={handleMarkerMouseOut}
			>
				{pins?.map((pin) => (
					<>
						<MarkerF
							key={pin.details.link}
							options={{
								optimized: false,
								icon: getIcon(pin)
							}}
							position={{
								lat: pin.lat,
								lng: pin.lng
							}}
							onClick={() => handleMarkerMouseOver(pin)}
						>
							{selectedMarkerUrl === pin.details.link && (
								<InfoWindowF
									key={pin.details.link}
									position={{
										lat: pin.lat,
										lng: pin.lng
									}}
									onCloseClick={handleMarkerMouseOut}
								>
									<>
										<a
											href={pin.details.link}
											target="_blank"
											className="text-blue-500"
										>
											more details
										</a>
										<div>{pin.details.price}</div>
									</>
								</InfoWindowF>
							)}
						</MarkerF>
					</>
				))}
			</GoogleMap>
		);
	};

	const memoizedGetGoogleMap = useMemo(() => getGoogleMap(), [pins]);

	if (!isLoaded) return <div>Loading....</div>;

	return (
		<>
			<h1>Map here</h1>
			<div className="w-100% h-96">
				{getGoogleMap()}
			</div>
		</>
	);
};

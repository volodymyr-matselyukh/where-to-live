import { useQuery } from "@tanstack/react-query"
import useAxios from "./agent"
import { PlaceDto } from "@/models/Place";

export default () => {
	const requests = useAxios();

	return {
		list: useQuery(['listPlaces'], async () => await requests.get<PlaceDto[]>('/place'))
	}
}

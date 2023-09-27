import Pin from "@/models/Pin";

interface Props{
	pins: Pin[];
}

export const Map = ({pins}: Props) => {
	return (
		<>
			<h1>Map here</h1>

			{pins.map(pin => (<div>{pin.details.name}</div>))}
		</>
	);
}
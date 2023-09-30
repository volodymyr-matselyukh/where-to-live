interface Props{
	lat: number;
	lng: number;
	text: string;
	url: string;
}

export default (props: Props) => {
	return (
		<div className="absolute bg-red-700 top-0 right-0">
			<a href={props.url}>pin here</a>
		</div>
	)
}
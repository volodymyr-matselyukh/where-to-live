"use client";

import { Map } from "../components/Map";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function Home() {
	

	return (
		<QueryClientProvider client={queryClient}>
			<Map />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
"use client";

import axios, { AxiosResponse } from "axios";
import { useRef } from "react";
import dotEnv from 'dotenv';

dotEnv.config();

export default function useAxios() {
	const instance = useRef(axios.create({
		baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
	}));

	const responseBody = <T>(response: AxiosResponse<T>) => response.data;

	const requests = {
		get: <T>(url: string) => instance.current.get<T>(url).then(responseBody),
		post: <T>(url: string, body: {}) => instance.current.post<T>(url, body).then(responseBody),
		postWithCredentials: <T>(url: string, body: {}) => instance.current.post<T>(url, body, { withCredentials: true }).then(responseBody),
		put: <T>(url: string, body: {}) => instance.current.put<T>(url, body).then(responseBody),
		del: <T>(url: string) => instance.current.delete<T>(url).then(responseBody),
	}

	return requests;
}
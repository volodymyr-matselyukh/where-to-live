import express from "express";
import { listPlacesAsync as listPlacesDbAsync } from '../db/Place';

export const listPlacesAsync = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try{
		const places = await listPlacesDbAsync();

		return res.status(200).json(places);

	}catch (error){
		console.error(error);
		return res.sendStatus(400);
	}
}
import { listPlacesAsync } from '../controllers/places';
import express from 'express';

export default (router: express.Router) => {
	router.get('/place', listPlacesAsync);
}
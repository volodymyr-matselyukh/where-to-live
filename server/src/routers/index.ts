import express from "express";
import places from './places';

const router = express.Router();

export default (): express.Router => {
	places(router);

	return router;
}
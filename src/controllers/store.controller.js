import { StatusCodes } from "http-status-codes";
import { bodyToStore, responseFromStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const storeData = bodyToStore(req.body);
    const result = await addStore(regionId, storeData);
    res
      .status(StatusCodes.CREATED)
      .json(responseFromStore(result, storeData));
  } catch (error) {
    next(error); // (에러 핸들러 미들웨어로 전달)
  }
};
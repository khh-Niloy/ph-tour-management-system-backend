import { NextFunction, Request, Response } from "express"
import { tourServices, tourTypeServices } from "./tour.service"
import { successResponse } from "../../utils/successResponse"
import { ITour } from "./tour.interface"

const createTourType = async(req: Request, res: Response)=>{
    try {
    const newTourType = await tourTypeServices.createTourTypeService(req.body)
        
    successResponse(res, {
      statusCode: 201,
      success: true,
      message: "tour type created",
      data: newTourType,
    });

    } catch (error) {
        console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
    }

}

const getAllTourType = async(req: Request, res: Response)=>{
    try {

    const {allTourType, totalTourType} = await tourTypeServices.getAllTourTypeService()

    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "all tour",
      meta: totalTourType,
      data: allTourType,
    });
    } catch (error) {
        console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
    }
}

const updateTourType = async(req: Request, res: Response)=>{
    try {
    
    const tourTypeId = req.params.id 
    const updatedTourType = await tourTypeServices.updateTourTypeService(req.body, tourTypeId)
        
    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "tour type updated",
      data: updatedTourType,
    });

    } catch (error) {
        console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
    }

}

const deleteTourType = async(req: Request, res: Response) =>{
    try {
    const tourTypeId = req.params.id
    await tourTypeServices.deleteTourTypeService(tourTypeId)

    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "tour type deleted",
      data: null,
    });
    } catch (error) {
        res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
    }
}

export const tourTypeController = {
    createTourType,
    getAllTourType,
    updateTourType,
    deleteTourType
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


const createTour = async(req: Request, res: Response, next: NextFunction)=>{
  try {

    const files = req.files as Express.Multer.File[]
    const imagePaths = files?.map(file => file.path)

    const payload : ITour = {
      ...req.body,
      images: imagePaths
    }

    const newTour = await tourServices.createTourService(payload)

    successResponse(res, {
      statusCode: 201,
      success: true,
      message: "tour created",
      data: newTour,
    });

  } catch (error) {
    // console.log(error);
    // res.status(400).json({
    //   success: false,
    //   message: (error as Error).message,
    // });
    next(error)
  }
}

const getAllTour = async(req: Request, res: Response)=>{
  try {
    const query = req.query
    const {newTour, meta} = await tourServices.getAllTourService(query as Record<string, string>)

    successResponse(res, {
      statusCode: 200,
      success: true,
      meta: meta,
      message: "all tour",
      data: newTour,
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
}

const updateTour = async(req: Request, res: Response)=>{
  try {
    const tourId = req.params.id
    const payload: ITour = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const updatedTour = await tourServices.updateTourService(payload, tourId)

    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "tour updated",
      data: updatedTour,
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
}


export const tourController = {
  createTour,
  getAllTour,
  updateTour
}
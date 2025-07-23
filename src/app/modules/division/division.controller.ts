import { Request, Response } from "express"
import { divisionServices } from "./division.service"
import { successResponse } from "../../utils/successResponse"

const createDivision = async(req: Request, res: Response) =>{
    try {
        const newDivision = await divisionServices.createDivisionService(req.body)

    successResponse(res, {
      statusCode: 201,
      success: true,
      message: "division created",
      data: newDivision,
    });
    } catch (error) {
        res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
    }
}

const getAllDivision = async(req: Request, res: Response)=>{
    try {
        const {allDivision, totalDivision} = await divisionServices.getAllDivisionService()
        successResponse(res, {
          statusCode: 200,
          success: true,
          meta: totalDivision,
          message: "all division",
          data: allDivision,
        });
    } catch (error) {
        res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
    }

}

const getSingleDivision = async(req: Request, res: Response) =>{
    try {
    const slug = req.params.slug
    console.log(slug)
    const singleDivision = await divisionServices.getSingleDivisionService(slug)

    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "single division",
      data: singleDivision,
    });
    } catch (error) {
        res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
    }
}

const updateDivision = async(req: Request, res: Response) =>{
    try {
    const divisionId = req.params.id
    const updatedDivision = await divisionServices.updateDivisionService(req.body, divisionId)

    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "division updated",
      data: updatedDivision,
    });
    } catch (error) {
        res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
    }
}

const deleteDivision = async(req: Request, res: Response) =>{
    try {
    const divisionId = req.params.id
    await divisionServices.deleteDivisionService(divisionId)

    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "division deleted",
      data: null,
    });
    } catch (error) {
        res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
    }
}

export const divisionController = {
    createDivision,
    getAllDivision,
    updateDivision,
    deleteDivision,
    getSingleDivision
}
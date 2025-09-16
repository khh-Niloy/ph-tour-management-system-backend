import { Request, Response } from "express"
import { divisionServices } from "./division.service"
import { successResponse } from "../../utils/successResponse"
import { IDivision } from "./division.interface"

const createDivision = async(req: Request, res: Response) =>{
    try {
      const payload : IDivision = {
          ...req.body,
        thumbnail: req.file?.path
      }

      const newDivision = await divisionServices.createDivisionService(payload)

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

    const payload : IDivision = {
      ...req.body,
      thumbnail: req.file?.path
    }

    const updatedDivision = await divisionServices.updateDivisionService(payload, divisionId)

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
import { deleteImageFromCloudinary } from "../../config/cloudinary.config"
import { Tour } from "../tour/tour.model"
import { IDivision } from "./division.interface"
import { Division } from "./division.model"

const createDivisionService = async(divisionInfo: IDivision)=>{
    const {name} = divisionInfo

    const isExistName = await Division.findOne({name})
    if(isExistName){
        throw new Error("name already exist!");
    }

    // divisionInfo.slug = (name+"-"+"division").toLowerCase()

    const newDivision = await Division.create(divisionInfo)

    return newDivision
}

const getAllDivisionService = async()=>{
    const allDivision = await Division.find({})
    const totalDivision = await Division.estimatedDocumentCount()
    return {allDivision, totalDivision}
}


const getSingleDivisionService = async(slug: string)=>{
    const singleDivision = await Division.find({slug: slug})
    console.log(singleDivision)
    if(!singleDivision){
        throw new Error("this division does not exist!");
    }
    return singleDivision
}

const updateDivisionService = async(divisionInfo : Partial<IDivision>, divisionId: string)=>{

    const division = await Division.findById(divisionId)

    if(!division){
        throw new Error("division not found");
    }

    const divisionName = await Division.findOne({name: divisionInfo.name})
    if(divisionName){
        throw new Error("division name already exist!");
    }

    // done with hook
    // if(divisionInfo.name){
    //     divisionInfo.slug = (divisionInfo.name+"-"+"division").toLowerCase()
    // }

    const updateDivision = await Division.findByIdAndUpdate(divisionId, divisionInfo, {new: true})

    if(divisionInfo.thumbnail && division?.thumbnail){
        await deleteImageFromCloudinary(division.thumbnail)
    }

    return updateDivision
}

const deleteDivisionService = async(divisionId: string)=>{

    const isDivisionExist = await Division.findById(divisionId)
    if(!isDivisionExist){
        throw new Error("division not exist!");
    }

    const isDivisionExistInTourCollec = await Tour.find({division: divisionId})

    // console.log(isDivisionExistInTourCollec)

    if(isDivisionExistInTourCollec.length !== 0){
        throw new Error("Cannot delete division because it is associated with one or more tours.");
    }

    await Division.findByIdAndDelete(divisionId)
}

export const divisionServices = {
    createDivisionService,
    getAllDivisionService,
    updateDivisionService,
    deleteDivisionService,
    getSingleDivisionService
}
import { IDivision } from "./division.interface"
import { Division } from "./division.model"

const createDivisionService = async(divisionInfo: IDivision)=>{
    const {name, slug, thumbnail, description} = divisionInfo

    const isExistName = await Division.findOne({name})
    if(isExistName){
        throw new Error("name already exist!");
    }

    const isSlugExist = await Division.findOne({slug})
    if(isSlugExist){
        throw new Error("slug already exist!");
    }

    const newDivision = await Division.create({
        name,
        slug,
        thumbnail,
        description
    })

    return newDivision
}

const getAllDivisionService = async()=>{
    const allDivision = await Division.find({})
    const totalDivision = await Division.estimatedDocumentCount()
    return {allDivision, totalDivision}
}

const updateDivisionService = async(divisionInfo : Partial<IDivision>, divisionId: string)=>{
    const updateDivision = await Division.findByIdAndUpdate(divisionId, divisionInfo, {new: true})
    return updateDivision
}

export const divisionServices = {
    createDivisionService,
    getAllDivisionService,
    updateDivisionService
}
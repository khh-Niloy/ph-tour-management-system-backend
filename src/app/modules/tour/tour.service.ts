import { Division } from "../division/division.model"
import { ITour, ITourType } from "./tour.interface"
import { Tour, TourType } from "./tour.model"


const createTourTypeService = async(payload: ITourType)=>{
    const newTourType = await TourType.create(payload)
    return newTourType
}

const getAllTourTypeService = async()=>{
    const allTourType = await TourType.find({})
    const totalTourType = await TourType.estimatedDocumentCount()
    return {allTourType, totalTourType}
}

const updateTourTypeService = async(payload: ITourType, tourTypeId: string)=>{
    const updateTourType = await TourType.findByIdAndUpdate(tourTypeId, payload, {new: true})
    return updateTourType
}

const deleteTourTypeService = async(tourTypeId: string)=>{
    const isTourTypeExistInTourCollec = await Tour.find({tourType: tourTypeId})

    // console.log(isTourTypeExistInTourCollec)

    if(isTourTypeExistInTourCollec.length !== 0){
        throw new Error("Cannot delete tour type because it is associated with one or more tours.");
    }

    await TourType.findByIdAndDelete(tourTypeId)
}


export const tourTypeServices = {
    createTourTypeService,
    getAllTourTypeService,
    updateTourTypeService,
    deleteTourTypeService
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const createTourService = async(tourInfo: ITour)=>{

    const {division, tourType} = tourInfo

    const isDivisionExist = await Division.findById(division)
    if(!isDivisionExist){
        throw new Error("this division does not exist!");
    }

    const istourTypeExist = await TourType.findById(tourType)
    if(!istourTypeExist){
        throw new Error("this tour type does not exist!");
    }

    const newTour = await Tour.create(tourInfo)
    return newTour
}


const getAllTourService = async()=>{
    const newTour = await Tour.find({})
    const totalTour = await Tour.estimatedDocumentCount()
    return {newTour, totalTour}
}


const updateTourService = async(tourInfo: Partial<ITour>, tourId: string)=>{
    if(tourInfo.tourType == undefined){
        throw new Error("tour type id required");
        
    }
    if(tourInfo.division == undefined){
        throw new Error("division id required");
        
    }

    const updatedTour = await Tour.findByIdAndUpdate(tourId, tourInfo, {new: true})
    return updatedTour
}


export const tourServices = {
    createTourService,
    getAllTourService,
    updateTourService
}

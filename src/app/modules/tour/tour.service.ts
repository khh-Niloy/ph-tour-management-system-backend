import { deleteImageFromCloudinary } from "../../config/cloudinary.config"
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

    // tourInfo.slug = tourInfo.title.split(" ").join("-").toLowerCase()

    const newTour = await Tour.create(tourInfo)
    return newTour
}


const getAllTourService = async(query : Record<string, string>)=>{

    // console.log(query)
    const fields = query.fields?.split(",").join(" ") || ""
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 10

    const skip = (page - 1) * limit // je koyta skip korbe
    // console.log(skip)

    /*
    page	limit	skip (items to skip)
    1	    10	    (1-1) * 10 = 0 → show 1–10
    2	    10	    (2-1) * 10 = 10 → show 11–20
    */
    
    const filter = query
    const searchTerm = query.searchTerm || ""
    const sort = query.sort || "-createdAt"
    
    // * cause filter does not need searchTerm! find(filter) -> here just need {location: "Comilla"}

    // for searchTerm -> location=Comilla&searchTerm=c
    // then i will get { location: 'Comilla', searchTerm: 'c' }, so for filter i need only {location: 'Comilla'}

    // for fields -> location=Comilla&fields=title
    
    delete filter["searchTerm"] // this will work when i will give both filter and searchTerm to work find(filter)
    delete filter["sort"]
    delete filter["fields"]
    // delete filter["page"]
    // delete filter["limit"]
    // console.log(filter)

    const searchArray = ["title", "description"]

    /*
    db.tours.find({
        $or: [
            { title: { $regex: "beach", $options: "i" } },
            { description: { $regex: "relax", $options: "i" } }
        ]
    })
    */

    const searchQuery = {
        $or: searchArray.map((field)=> ({[field]: {$regex: searchTerm, $options: "i"}}))
    }

    const newTour = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit)
    const totalCount = await Tour.estimatedDocumentCount()

    const totalTour = query ? newTour.length : totalCount
    const totalPage = Math.ceil(totalCount/limit)
    console.log(totalPage)

    const meta = {
        total: totalTour,
        page: page,
        limit: limit,
        totalPage: totalPage
    }

    return {newTour, totalTour}
}


const updateTourService = async(payload: Partial<ITour>, tourId: string)=>{

    const existingTour = await Tour.findById(tourId)

    if(!existingTour){
        throw new Error("tour not found");
    }

    if(payload.tourType == undefined){
        throw new Error("tour type id required");
    }
    if(payload.division == undefined){
        throw new Error("division id required");
    }

    // if(tourInfo.title){
    //     tourInfo.slug = tourInfo.title.split(" ").join("-").toLowerCase()
    // }

    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images]
    }

    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {

        const restDBImages = existingTour.images.filter(imageUrl => !payload.deleteImages?.includes(imageUrl))

        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
            .filter(imageUrl => !restDBImages.includes(imageUrl))

        payload.images = [...restDBImages, ...updatedPayloadImages]
    }

    const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, {new: true})

    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        await Promise.all(payload.deleteImages.map(url => deleteImageFromCloudinary(url)))
    }

    return updatedTour
}


export const tourServices = {
    createTourService,
    getAllTourService,
    updateTourService
}

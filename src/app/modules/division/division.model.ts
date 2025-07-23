import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>({
    name: {type: String, required: true, unique: true},
    slug: {type: String, unique: true},
    thumbnail: {type: String, default: ""},
    description: {type: String, default: ""},
}, {
    timestamps: true,
    versionKey: false
})

divisionSchema.pre("save", async function(next){
    if(this.isModified("name")){
        this.slug = (this.name+"-"+"division").toLowerCase()
    }
    next()
})

divisionSchema.pre("findOneAndUpdate", async function(next){
    const division = this.getUpdate() as IDivision

    if(division.name){
        division.slug = (division.name+"-"+"division").toLowerCase()
    }

    this.setUpdate(division)

    next()
})

export const Division = model<IDivision>("Divison", divisionSchema)
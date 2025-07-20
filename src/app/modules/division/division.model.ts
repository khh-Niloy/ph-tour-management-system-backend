import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>({
    name: {type: String, required: true, unique: true},
    slug: {type: String, unique: true, required: true},
    thumbnail: {type: String, default: ""},
    description: {type: String, default: ""},
}, {
    timestamps: true,
    versionKey: false
})

export const Division = model<IDivision>("Divison", divisionSchema)
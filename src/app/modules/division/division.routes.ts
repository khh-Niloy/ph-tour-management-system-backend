import { Router } from "express";
import { divisionController } from "./division.controller";
import { validateSchema } from "../../middleware/zodValidate";
import { divisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";

export const divisionRoutes = Router()

divisionRoutes.post("/create", multerUpload.single("file"), roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN), validateSchema(divisionZodSchema), divisionController.createDivision)

divisionRoutes.get("/", divisionController.getAllDivision)

divisionRoutes.get("/:slug", divisionController.getSingleDivision)

divisionRoutes.patch("/:id", roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN), validateSchema(updateDivisionZodSchema), divisionController.updateDivision)

divisionRoutes.delete("/:id", roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN), divisionController.deleteDivision)
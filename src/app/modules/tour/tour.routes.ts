import { Router } from "express";
import { tourController, tourTypeController } from "./tour.controller";
import { validateSchema } from "../../middleware/zodValidate";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";
import { Role } from "../user/user.interface";
import { tourTypeZodSchema, tourZodSchema, upadteTourZodSchema, updateTourTypeZodSchema } from "./tour.validation";
import { multerUpload } from "../../config/multer.config";

export const tourRoutes = Router()

tourRoutes.post("/create-tour-type", 
roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN),
validateSchema(tourTypeZodSchema),
tourTypeController.createTourType)

tourRoutes.get("/tour-types", tourTypeController.getAllTourType)

tourRoutes.patch("/tour-types/:id", validateSchema(updateTourTypeZodSchema), 
roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN),
tourTypeController.updateTourType)

tourRoutes.delete("/tour-types/:id", roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN), tourTypeController.deleteTourType)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


tourRoutes.post("/create",multerUpload.array("files"), validateSchema(tourZodSchema), roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN),
tourController.createTour)

tourRoutes.get("/", tourController.getAllTour)

tourRoutes.get("/:id", tourController.getSingleTour)

tourRoutes.patch("/:id",validateSchema(upadteTourZodSchema),roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN), tourController.updateTour) 


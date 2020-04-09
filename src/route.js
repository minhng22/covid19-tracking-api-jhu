import { Router } from 'express'
import {country_controller} from './controller/index'
const router = Router()

router.get("/country", country_controller.show)
router.get("/countr/:countryName/case", country_controller.show)

router.get("/state/:stateName/case")
export default router

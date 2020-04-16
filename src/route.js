import { Router } from 'express'
import {case_controller, country_controller, state_controller, county_controller} from './controller/index'
const router = Router()

router.get("/country", country_controller.show)
router.get("/state", state_controller.show)
router.get("/county", county_controller.show)

router.get("/case", case_controller.show)
router.get("/case-analyze", case_controller.analyze)

export default router

import { Router } from 'express'
import {case_controller, country_controller} from './controller/index'
const router = Router()

router.get("/country", country_controller.show)

router.get("/case", case_controller.show)
router.get("/case-analyze", case_controller.analyze)

export default router

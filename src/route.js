import { Router } from 'express'
import {country_controller} from './controller/index'
const router = Router()

router.get("/country", country_controller.show)

export default router

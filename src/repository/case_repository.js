import {case_model} from '../model/index'

export const get = (params) => {
    return case_model.case_MG_model.find(params).lean()
}
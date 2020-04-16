import {case_model} from '../model/index'

export const get = (death_case = false, params) => {
    return death_case ? case_model.case_MG_death_model.find(params).lean(): case_model.case_MG_model.find(params).lean() 
}
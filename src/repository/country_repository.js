import {country_model} from '../model/index'

export const get = (death_case = false, params) => {
    return death_case ? country_model.country_death_MG_model.find(params).lean(): country_model.country_MG_model.find(params).lean()
}
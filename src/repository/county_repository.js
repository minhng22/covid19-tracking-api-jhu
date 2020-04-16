import {county_model} from '../model/index'

export const get = (death_case = false, params) => {
    console.log('PARAMS: ', params)
    return death_case ? county_model.county_death_MG_model.find(params).lean(): county_model.county_MG_model.find(params).lean()
}
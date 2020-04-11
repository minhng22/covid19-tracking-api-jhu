import {county_model} from '../model/index'

export const get = (params) => {
    console.log('PARAMS: ', params)
    return county_model.county_MG_model.find(params).lean()
}
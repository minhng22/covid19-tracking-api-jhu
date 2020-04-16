import {state_model} from '../model/index'

export const get = (death_case = false, params) => {
    console.log('STATE params: ', params)
    return death_case ? state_model.state_death_MG_model.find(params).lean(): state_model.state_MG_model.find(params).lean()
}
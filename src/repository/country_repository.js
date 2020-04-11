import country_model from '../model/index'

export const get = (params) => {
    return country_model.country_MG_model.find(params).lean()
}

export const d_get = (params) => {
    return country_model.country_death_MG_model.find(params).lean()
}
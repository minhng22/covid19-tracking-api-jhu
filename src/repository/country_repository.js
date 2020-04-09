import {Schema, model} from 'mongoose'
import country_model from '../model/index'

let country_MG_schema = new Schema({
    name: {type: String}
})
let country = model('Country', country_MG_schema, 'Country')
let country_death = model('CountryDeath', country_MG_schema, 'CountryDeath')

export const get = (params) => {
    return country.find(params)
}

export const d_get = (params) => {
    return country_death.find(params)
}
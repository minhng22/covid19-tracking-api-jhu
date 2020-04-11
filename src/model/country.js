import {Schema, model} from 'mongoose'

export const country_MG_schema = new Schema({
    name: {type: String}
})
export const country_MG_model = model('Country', country_MG_schema, 'Country')
export const country_death_MG_model = model('CountryDeath', country_MG_schema, 'CountryDeath')
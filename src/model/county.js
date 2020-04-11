import {Schema, model} from 'mongoose'

export const county_MG_schema = new Schema({
    state_id: {type: String},
    name: {type: String}
})
export const county_MG_model = model('County', county_MG_schema, 'County')
export const county_death_MG_model = model('CountyDeath', county_MG_schema, 'CountyDeath')
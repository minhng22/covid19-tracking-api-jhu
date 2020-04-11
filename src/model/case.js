import {Schema, model} from 'mongoose'

export const case_MG_schema = new Schema({
    no: {type: String},
    territory_id: {type: String},
    territory_type: {type: String}
})
export const case_MG_model = model('Case', case_MG_schema, 'Case')
export const case_MG_death_model = model('CaseDeath', case_MG_schema, 'CaseDeath')
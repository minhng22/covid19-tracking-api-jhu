import {Schema, model} from 'mongoose'

export const state_MG_schema = new Schema({
    state_id: {type: String},
    name: {type: String}
})
export const state_MG_model = model('State', state_MG_schema, 'State')
export const state_death_MG_model = model('StateDeath', state_MG_schema, 'StateDeath')
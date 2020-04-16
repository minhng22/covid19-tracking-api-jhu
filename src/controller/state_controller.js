import {state_repository} from '../repository/index'

export const show = (req, res) => {
    const params = {}
    let death_case = false

    if (req.query.id) {
        params['id'] = req.query.id
    }
    if (req.query.name) {
        params['name'] = req.query.name
    }
    if (req.query.country_id) {
        params['country_id'] = req.query.country_id
    }
    console.log(req.query.DEATH_CASE)
    if (req.query.DEATH_CASE && req.query.DEATH_CASE == 'TRUE') {
        console.log('here')
        death_case = true
    }
    
    state_repository.get(death_case, params).exec((err, states) => {
        res.status(200).json(states)
    })
}


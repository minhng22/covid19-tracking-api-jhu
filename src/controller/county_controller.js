import {county_repository} from '../repository/index'

export const show = (req, res) => {
    const params = {}
    let death_case = false

    if (req.query.id) {
        params['id'] = req.query.id
    }
    if (req.query.name) {
        params['name'] = req.query.name
    }
    if (req.query.DEATH_CASE && req.query.DEATH_CASE == 'TRUE') {
        death_case = true
    }

    county_repository.get(death_case, params).exec((err, countries) => {
        res.status(200).json(countries)
    })
}


import {country_repository} from '../repository/index'

export const show = (req, res) => {
    country_repository.get(req.query).exec((err, countries) => {
        res.status(200).json(countries)
    })
}


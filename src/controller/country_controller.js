import {country_repository} from '../repository/index'

export const show = async (req, res) => {
    const countries_querry = country_repository.get(req.params)
    countries_querry.exec((err, countries) => {
        res.status(200).json(countries)
    })
}

export const showCases = async (req, res) => {
    
}


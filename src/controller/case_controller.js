import {case_repository, county_repository} from '../repository/index'

export const show = async (req, res) => {
    const data = []
    for (let i = 0; i < req.query.territory_id.length; i++){
        if (req.query.territory_type[i] == 'COUNTRY' || req.query.territory_type[i] == 'COUNTY'){
            await case_repository.get({
                'territory_id': req.query.territory_id[i],
                'territory_type': req.query.territory_type[i]
            }).exec().then((c) => {
                data.push({
                    'territory_id': req.query.territory_id[i],
                    'territory_type': req.query.territory_type[i],
                    'case': c
                })
            })
        } else if (req.query.territory_type[i] == 'STATE' ){
            await county_repository.get({
                'state_id': req.query.territory_id[i]
            }).exec().then(async (counties) => {
                let state_data_full = []
                console.log(counties)

                for (let county of counties) {
                    await case_repository.get({
                        'territory_id': county._id,
                        'territory_type': 'COUNTY'
                    }).exec().then((c) => {
                        state_data_full.push(c)
                    })
                }
                data.push({
                    'territory_id': req.query.territory_id[i],
                    'territory_type': 'STATE',
                    'case': state_data_full
                })
            })
        }
    }
    res.status(200).send(data)
    
}

export const analyze = async(req, res) => {
    const data = []
    for (let i = 0; i < req.query.territory_id.length; i++){
        if (req.query.territory_type[i] == 'COUNTRY' || req.query.territory_type[i] == 'COUNTY'){
            await case_repository.get({
                'territory_id': req.query.territory_id[i],
                'territory_type': req.query.territory_type[i]
            }).exec().then((c) => {
                let c_return = sort_time_stampt_dict(make_dict(c, 'timestamp', 'no'))
                
                if (req.query.CAPITA_PERCENTAGE == 'TRUE') {
                    c_return = to_capita_percentage(c_return, req.query.territory_capita[i])
                }

                if (req.query.DAILY_PERCENTAGE == 'TRUE') {
                    c_return = to_percentage(c_return)
                }

                if (req.query.LATEST_ONLY == 'TRUE'){
                    c_return = get_dict_latest(c_return)
                }

                data.push({
                    'territory_id': req.query.territory_id[i],
                    'territory_type': req.query.territory_type[i],
                    'case': c_return
                })
            })
        } else if (req.query.territory_type[i] == 'STATE' ){
            await county_repository.get({
                'state_id': req.query.territory_id[i]
            }).exec().then(async (counties) => {
                let state_data = {}
                console.log(counties)

                for (let county of counties) {
                    await case_repository.get({
                        'territory_id': county._id,
                        'territory_type': 'COUNTY'
                    }).exec().then((c) => {
                        let c_extracted = make_dict(c, 'timestamp', 'no')
                            if (Object.keys(state_data).length == 0) {
                                state_data = c_extracted
                            } else {
                                for (let case_data of c) {
                                    var t = case_data['timestamp']
                                    state_data[t] = (parseInt(state_data[t]) + parseInt(case_data['no'])).toString()
                                }
                            }
                    })
                }

                state_data = sort_time_stampt_dict(state_data)

                if (req.query.CAPITA_PERCENTAGE == 'TRUE') {
                    state_data = to_capita_percentage(state_data, req.query.territory_capita[i] )
                }

                if (req.query.DAILY_PERCENTAGE == 'TRUE') {
                    state_data = to_percentage(state_data)
                }

                if (req.query.LATEST_ONLY == 'TRUE'){
                    state_data = get_dict_latest(state_data)
                }
                data.push({
                    'territory_id': req.query.territory_id[i],
                    'territory_type': 'STATE',
                    'case': state_data
                })
            })
        }
    }
    res.status(200).send(data)
}

const extract_dict_arr = (dict, params) => {
    let e = []
    for (let v of dict){
        console.log('v is ' + v['timestamp'])
        
        let new_v = {}
        for (let p of params) {
            new_v[p] = v[p]
        }
        e.push(new_v)
    }
    return e
}

const make_dict = (dict, key, value, LATEST_ONLY = false) => {
    let d = {}
    for (let v of dict){
        let new_k = v[key]
        let new_v = v[value]
        d[new_k] = new_v
    }
    console.log(d)

    return LATEST_ONLY ? get_dict_latest(d) : d
}

/**
 * Sort array of obj by timestampe
 * @param {*} dict A dictionary in form of {<time_stamp>: <value>}
 */
const sort_time_stampt_dict = (obj) => {
    return Object.keys(obj).sort((a,b) => (new Date(a) > new Date(b)) ? 1: -1).reduce((r, k) => (r[k] = obj[k], r), {})
}

const get_dict_latest = (dict) => {
    let d_latest = {}
    let t = get_latest_time_no(dict)

    console.log('latest_time is ', t)
    d_latest[t] = dict[t]

    return d_latest
}

/**
 * 
 * @param {*} dict : A dictionary in form of {<time_stamp>: <value>}
 */
const get_latest_time_no = (dict) => {
    let l = Object.keys(dict)[0]
    for (let date_key in dict){
        if (new Date(l) < new Date(date_key))
            l = date_key
    }
    return l
}

const data_mode = {
    'FULL': 'Include case id',
    'PLAIN': 'Extract data in <time_stamp>: <no> format',
    'LATEST_ONLY': 'Include only latest case'
}

/**
 * Convert number value in dict to daily change percentage
 * @param {*} dict A dictionary in form of {<time_stamp>: <value>}
 */
const to_percentage = (dict) => {
    let found_non_zero_ld= false
    let first_non_zero = false
    let last_day_no = 0

    for (const [key, value] of Object.entries(dict)){
        if (value != 0) {
            found_non_zero_ld = true
        }
        if (found_non_zero_ld){
            if(!first_non_zero){
                dict[key] = (((parseFloat(value) / last_day_no) * 100) - 100).toString()
            } else {
                dict[key] = "0"
                first_non_zero = true
            }
            last_day_no = parseFloat(value)
        }
    }
    return dict
}

/**
 * Convert number value in dict to capita percentage
 * @param {*} dict A dictionary in form of {<time_stamp>: <value>}
 */
const to_capita_percentage = (dict, capita) => {
    for (const [key, value] of Object.entries(dict)){
        dict[key] = ((parseFloat(value) / capita) * 100).toString()
    }
    return dict
}
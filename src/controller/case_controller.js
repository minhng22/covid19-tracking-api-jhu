import {case_repository, county_repository} from '../repository/index'
import {logic_helper as lh} from '../helper/index'

export const show = async (req, res) => {
    const data = []
    let death_case = false 

    if (req.query.DEATH_CASE && req.query.DEATH_CASE == 'TRUE') {
        death_case = true
    }
    for (let i = 0; i < req.query.territory_id.length; i++){
        if (req.query.territory_type[i] == 'COUNTRY' || req.query.territory_type[i] == 'COUNTY'){
            await case_repository.get(death_case,{
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
            await county_repository.get(death_case, {
                'state_id': req.query.territory_id[i]
            }).exec().then(async (counties) => {
                let state_data_full = []
                console.log(counties)

                for (let county of counties) {
                    await case_repository.get(death_case, {
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
    const death_case = false 

    if (req.query.DEATH_CASE && req.query.DEATH_CASE == 'TRUE') {
        death_case = true
    }

    if (req.query.territory_id){
        for (let i = 0; i < req.query.territory_id.length; i++){
            if (req.query.territory_type[i] == 'COUNTRY' || req.query.territory_type[i] == 'COUNTY'){
                await case_repository.get(death_case, {
                    'territory_id': req.query.territory_id[i],
                    'territory_type': req.query.territory_type[i]
                }).exec().then((c) => {
                    let c_return = lh.sort_time_stampt_dict(lh.make_dict(c, 'timestamp', 'no'))
                    
                    if (req.query.DAILY_NEW_CASE == 'TRUE') {
                        c_return = lh.new_case(c_return)
                    }
                    
                    if (req.query.CAPITA_PERCENTAGE == 'TRUE') {
                        c_return = lh.to_capita_percentage(c_return, req.query.territory_capita[i])
                    }
    
                    if (req.query.DAILY_PERCENTAGE == 'TRUE') {
                        c_return = lh.to_percentage(c_return)
                    }
    
                    if (req.query.LATEST_ONLY == 'TRUE'){
                        c_return = lh.get_dict_latest(c_return)
                    }
    
                    data.push({
                        'territory_id': req.query.territory_id[i],
                        'territory_type': req.query.territory_type[i],
                        'case': c_return
                    })
                })
            } else if (req.query.territory_type[i] == 'STATE' ){
                await county_repository.get(death_case, {
                    'state_id': req.query.territory_id[i]
                }).exec().then(async (counties) => {
                    let state_data = {}
                    console.log(counties)
    
                    for (let county of counties) {
                        await case_repository.get(death_case, {
                            'territory_id': county._id,
                            'territory_type': 'COUNTY'
                        }).exec().then((c) => {
                            let c_extracted = lh.make_dict(c, 'timestamp', 'no')
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
    
                    state_data = lh.sort_time_stampt_dict(state_data)
    
                    if (req.query.DAILY_NEW_CASE == 'TRUE') {
                        state_data = lh.new_case(state_data)
                    }
    
                    if (req.query.CAPITA_PERCENTAGE == 'TRUE') {
                        state_data = lh.to_capita_percentage(state_data, req.query.territory_capita[i] )
                    }
    
                    if (req.query.DAILY_PERCENTAGE == 'TRUE') {
                        state_data = lh.to_percentage(state_data)
                    }
    
                    if (req.query.LATEST_ONLY == 'TRUE'){
                        state_data = lh.get_dict_latest(state_data)
                    }
                    data.push({
                        'territory_id': req.query.territory_id[i],
                        'territory_type': 'STATE',
                        'case': state_data
                    })
                })
            }
        }
    }
    res.status(200).send(data)
}
export const extract_dict_arr = (dict, params) => {
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


export const make_dict = (dict, key, value, LATEST_ONLY = false) => {
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
export const sort_time_stampt_dict = (obj) => {
    return Object.keys(obj).sort((a,b) => (new Date(a) > new Date(b)) ? 1: -1).reduce((r, k) => (r[k] = obj[k], r), {})
}

export const get_dict_latest = (dict) => {
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
export const get_latest_time_no = (dict) => {
    let l = Object.keys(dict)[0]
    for (let date_key in dict){
        if (new Date(l) < new Date(date_key))
            l = date_key
    }
    return l
}

/**
 * Convert number value in dict to daily change percentage
 * @param {*} dict A dictionary in form of {<time_stamp>: <value>}
 */
export const to_percentage = (dict) => {
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
export const to_capita_percentage = (dict, capita) => {
    for (const [key, value] of Object.entries(dict)){
        dict[key] = ((parseFloat(value) / capita) * 100).toString()
    }
    return dict
}

/**
 * Get daily new number
 * @param {*} dict A dictionary in form of {<time_stamp>: <value>}
 */
export const new_case = (dict) => {
    let i = 0
    let last_day = 0

    for (const [key, value] of Object.entries(dict)){
        if (i != 0){
            dict[key] = (parseFloat(value) - last_day).toString()
        }
        last_day = parseFloat(value)
        i += 1
    }
    return dict
}
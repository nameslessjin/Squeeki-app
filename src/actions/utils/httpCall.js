import {http, http_upload, http_no_graphql} from '../../../server_config'

export const httpCall = async(token, graphql) => {

    let req = {}

    if (token != null){
        req = await fetch(http, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphql)
        })
    } else {
        req = await fetch(http, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphql)
        })
    }

    const result = await req.json()

    return result
}
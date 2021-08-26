export const searchLocationQuery = `
query searchLocation($input: LocationInput!){
    searchLocation(input: $input){
        description
        place_id
    }
}
`

export const getLocationQuery = `
query getLocation($input: LocationInput!){
    getLocation(input: $input){
        lat
        lng
    }
}
`
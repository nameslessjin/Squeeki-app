export const getGroupNominationsQuery = `
query getGroupNominations($groupId: ID!, $lastIndexId: String){
    getGroupNominations(groupId: $groupId, lastIndexId: $lastIndexId){
        id
        groupId
        points
        period
        name
        createdAt
        on
    }
}
`;

export const getGroupNominationMostRecentResultsQuery = `
query getGroupNominationMostRecentResults($input: getGroupNominationResultsInput!){
    getGroupNominationMostRecentResults(input: $input){
        time
        list {
            nomination_name
            list {
                nominee_name
                vote
            }
        }
    }
}
`;

export const getGroupNominationResultsQuery = `
query getGroupNominationResults($input: getGroupNominationResultsInput!){
    getGroupNominationResults(input: $input){
        count
        oldResultList {
            time
            list {
                nomination_name
                list {
                    nominee_name
                    vote
                }
            }
        }
    }
}
`;

export const createNominationMutation = `
mutation createNomination($input: NominationInput!){
    createNomination(input: $input)
}
`;

export const updateNominationMutation = `
mutation updateNomination($input: NominationInput!){
    updateNomination(input: $input)
}
`;
export const deleteNominationMutation = `
mutation deleteNomination($id: ID!){
    deleteNomination(id: $id)
}
`;

export const turnNominationMutation = `
mutation turnNomination($id: ID!){
    turnNomination(id: $id)
}
`;

export const voteNomineeMutation = `
mutation voteNominee($input: UserNominationInput!){
    voteNominee(input: $input)
}
`;

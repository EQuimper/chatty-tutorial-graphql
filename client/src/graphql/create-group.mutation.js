import gql from 'graphql-tag';

export const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($name: String!, $userIds: [Int!], $userId: Int!) {
    createGroup(name: $name, userIds: $userIds, userId: $userId) {
      id
      name
      users {
        id
      }
    }
  }
`;
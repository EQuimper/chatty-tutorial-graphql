import gql from 'graphql-tag';

import {MESSAGE_FRAGMENT} from './message.fragment';

export const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($name: String!, $userIds: [Int!], $userId: Int!) {
    createGroup(name: $name, userIds: $userIds, userId: $userId) {
      id
      name
      users {
        id
      }
      messages(limit: 1) { # we don't need to use variables
        ...MessageFragment
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;
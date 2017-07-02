import gql from 'graphql-tag';

export const LEAVE_GROUP_MUTATION = gql`
  mutation leaveGroup($id: Int!, $userId: Int!) {
    leaveGroup(id: $id, userId: $userId) {
      id
    }
  }
`;

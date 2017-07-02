import gql from 'graphql-tag';

export const DELETE_GROUP_MUTATION = gql`
  mutation deleteGroup($id: Int!) {
    deleteGroup(id: $id) {
      id
    }
  }
`;
import { gql } from "apollo-boost";

export const GET_USERS = gql`
  {
    users {
      id
      name
      repo
      age
    }
  }
`;

export const GET_USERS_FILTERED = gql`
  query($filter: String!, $keyword: String!) {
    filteredUser(filter: $filter, keyword: $keyword) {
      id
      name
      repo
      age
    }
  }
`;

export const VIEW_USER = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      name
      repo
      age
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($name: String!, $repo: String!, $age: Int!) {
    createUser(name: $name, repo: $repo, age: $age) {
      id
      name
      repo
      age
    }
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($id: ID!, $name: String!, $repo: String!, $age: Int!) {
    updateUser(id: $id, name: $name, repo: $repo, age: $age) {
      id
    }
  }
`;

export const DELETE_USER = gql`
  mutation DelUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

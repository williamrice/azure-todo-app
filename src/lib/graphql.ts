//https://learn.microsoft.com/en-us/azure/static-web-apps/database-azure-cosmos-db?tabs=bash#prerequisites

import { Todo } from "@/App";

export async function getAllTodos() {
  const query = {
    query: `query {
          todos{
            items{
              id
              text
              completed
            }
          }
        }`,
  };

  const endpoint = "/data-api/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  const result = await response.json();
  return result.data.todos.items;
}

export async function createTodo(todo: Todo) {
  const query = {
    query: `mutation create($item: CreatetodosInput!) {
          createtodos(item: $item) {
            id
            text
            completed
          }
        }`,
    variables: {
      item: todo,
    },
  };

  const endpoint = "/data-api/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  const result = await response.json();
  return result.data.createtodos;
}

export async function deleteTodo(id: string) {
  const gql = `
    mutation del($id: ID!, $_partitionKeyValue: String!) {
      deletetodos(id: $id, _partitionKeyValue: $_partitionKeyValue) {
        id
      }
    }`;

  const query = {
    query: gql,
    variables: {
      id: id,
      _partitionKeyValue: id,
    },
  };

  const endpoint = "/data-api/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });

  const result = await response.json();
  return result.data.deletetodos;
}

export async function updateTodo(id: string, todo: Todo) {
  const query = {
    query: `mutation update($id: ID!, $_partitionKeyValue: String!, $item: UpdatetodosInput!) {
          updatetodos(id: $id, _partitionKeyValue: $_partitionKeyValue, item: $item) {
            id
            text
            completed
          }
        }`,
    variables: {
      id: id,
      _partitionKeyValue: id,
      item: todo,
    },
  };

  const endpoint = "/data-api/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  console.log(response);
  const result = await response.json();
  console.log(result);
  return result.data.updatetodos;
}

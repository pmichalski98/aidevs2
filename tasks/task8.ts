export async function handleTask() {
  return {
    name: "addUser",
    description: "add user",
    type: "object",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "user name",
        },
        surname: {
          type: "string",
          description: "user surname",
        },
        year: {
          type: "integer",
          description: "user year of birth",
        },
      },
    },
  };
}

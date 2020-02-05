import { GraphQLClient } from 'graphql-request'

const updateUser = async (id, args, context) => {
  const { user } = context

  const query = `
    mutation(
      $input: UpdateUser!
    ) {
      updateUser(
        input: $input
      )
    }
  `

  const client = new GraphQLClient('http://127.0.0.1:33005/graphql', {
    headers: { 'user-id': user.id },
  })

  await client.request(query, args)

  return {}
}

export default updateUser

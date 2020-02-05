import { GraphQLClient } from 'graphql-request'

const deleteInvite = async (args, context) => {
  const { user } = context

  const query = `
    mutation(
      $inviteID: String!
    ) {
      deleteInvite(
        inviteID: $inviteID
      )
    }
  `

  const client = new GraphQLClient('http://127.0.0.1:33005/graphql', {
    headers: { 'user-id': user.id },
  })

  const data = await client.request(query, args)

  return data.deleteInvite
}

export default deleteInvite

import { useCallback } from 'react'
import { useMutation } from 'react-apollo-hooks'

import gql from 'graphql-tag'

export const EXEC_GCODES = gql`
  mutation execGCodes($input: ExecGCodesInput!) {
    execGCodes(input: $input) { id }
  }
`

const useExecGCodes = (callback, dependencies) => {
  const [execGCodes, results] = useMutation(EXEC_GCODES)

  if (results.error) {
    console.error(results.error)
    throw results.error
  }

  return useCallback((...args) => {
    const {
      machine,
      machineID,
      gcodes,
      sync,
      ...mutationOptions
    } = callback(...args)

    execGCodes({
      ...mutationOptions,
      variables: {
        input: {
          machineID: machineID || machine.id,
          gcodes,
          sync,
        },
      },
    })
  }, dependencies)
}

export default useExecGCodes

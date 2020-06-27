import React, { useEffect } from 'react'
import gql from 'graphql-tag'

import useConfirm from '../../../common/_hooks/useConfirm'
import { useMutation } from 'react-apollo-hooks'

const deleteConfigMutation = gql`
  mutation deleteConfig($input: DeleteConfigInput!) {
    deleteConfig(input: $input)
  }
`

const useDeleteConfig = ({
  show,
  id,
  collection,
  machineID,
  history,
  onDelete,
  fullTitle,
  title,
  type,
}) => {
  const confirm = useConfirm()

  const [deleteConfig] = useMutation(deleteConfigMutation)

  // const confirmedDeleteConfig = confirm(() => {
  //   return {
  //     fn: async () => {
  //       if (onDelete != null) {
  //         return onDelete()
  //       }

  //       const input = {
  //         configFormID: id,
  //         collection,
  //         machineID,
  //       }
  
  //       await deleteConfig({ variables: { input } })

  //       history.push('../')
  //     },
  //     title: fullTitle ? title : `Delete ${title}?`,
  //     description: (
  //       `This ${type}'s configuration will be perminently deleted.`
  //     ),
  //   }
  // })

  // useEffect(() => {
  //   if (show) confirmedDeleteConfig()
  // }, [show])
}

export default useDeleteConfig

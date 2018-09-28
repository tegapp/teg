import tql from 'typiql'
import snl from 'strip-newlines'

import actionResolver from '../../util/actionResolver'
import createLocalFileJob from '../actions/createLocalFileJob'
import getJob from '../selectors/getJob'

import JobGraphQL from '../types/Job.graphql'

const createLocalFileJobGraphQL = () => ({
  type: tql`${JobGraphQL}!`,
  description: snl`
    creates a job to print a file already on the Tegh server.
  `,

  resolve: actionResolver({
    actionCreator: createLocalFileJob,
    selector: (state, action) => getJob(state)(action.payload.job.id),
  }),

  args: {
    printerID: {
      type: tql`ID!`,
    },
    localPath: {
      type: tql`String`,
    },
  },
})

export default createLocalFileJobGraphQL
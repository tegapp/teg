import {default as _fs} from 'fs'

const fs = Promise.promisifyAll(_fs)

import spoolTask from './spoolTask'

export const spoolJobFile = ({ JobFileID }) => {
  return (dispatch, getState) => {
    const state = getState()
    const jobFile = state.jobQueue.jobFiles[JobFileID]

    const fileContent = await fs.readAsync(jobFile.filePath)

    const action = spoolTask({
      internal: false,
      priority: 'normal',
      jobID: jobFile.jobID,
      jobFileID: jobFile.id,
      file: {
        name: jobFile.name,
        content: fileContent,
      }
    })

    return dispatch(action)
  }
}
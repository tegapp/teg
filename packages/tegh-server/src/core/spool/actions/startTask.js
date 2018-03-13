export const START_TASK = 'tegh-server/spool/START_TASK'

/*
 * Accepted by the taskReducer but not exposed by the spoolReducer. Calling
 * startTask outside of the taskReducer is a no-op
 */
export const startTask = () => ({
  type: START_TASK,
})

export default startTask
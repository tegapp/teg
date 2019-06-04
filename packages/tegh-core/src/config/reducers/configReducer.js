import { loop, Cmd } from 'redux-loop'

import { SET_TOOLHEAD_MATERIALS } from '../actions/setToolheadMaterials'
import { SET_CONFIG } from '../actions/setConfig'
import requestSetConfig from '../actions/requestSetConfig'
import saveConfig from '../sideEffects/saveConfig'

import { CREATE_INVITE } from '../../auth/actions/createInvite'

export const initialState = null

const configReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOOLHEAD_MATERIALS:
    case SET_CONFIG: {
      const {
        config,
        onComplete,
        onError,
      } = action.payload

      // If the config is being changed by a user then save it to disk.
      if (state != null) {
        return loop(
          config,
          Cmd.run(saveConfig, {
            args: [{
              config,
              onComplete,
              onError,
            }],
          }),
        )
      }

      return config
    }
    case CREATE_INVITE: {
      const { invite } = action.payload

      const nextConfig = state
        .updateIn(['auth', 'invites'], invites => invites.push(invite))

      const nextAction = requestSetConfig({
        config: nextConfig,
      })

      return loop(
        state,
        Cmd.action(nextAction),
      )
    }
    default: {
      return state
    }
  }
}

export default configReducer

import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'
import tql from 'typiql'
import snl from 'strip-newlines'

import PrinterModeEnum from './printer_mode_enum.js'
import HeaterType from './heater_type.js'
import FanType from './fan_type.js'
import JobType from './job_type.js'
import LogEntryType from './log_entry_type.js'
import MacroDefinitionType from './macro_definition_type.js'
import PrinterErrorType from './PrinterErrorType'

const Printer = new GraphQLObjectType({
  name: 'Printer',
  fields: () => ({
    id: {
      type: tql`ID!`,
      resolve(source) {
        return source.config.id
      },
    },
    name: {
      type: tql`String!`,
      resolve(source) {
        return source.config.name
      },
    },
    // mode: {
    //   type: tql`${PrinterModeEnum}!`,
    // },
    heaters: {
      type: tql`[${HeaterType}!]!`,
      resolve(source) {
        return Object.values(source.driver.heaters)
      },
    },
    targetTemperaturesCountdown: {
      type: tql`Float`,
      description: snl`
        The estimated number of seconds until the heater(s) reach their
        targetTemperature.
      `,
      resolve(source) {
        return source.driver.targetTemperaturesCountdown
      },
    },
    fans: {
      type: tql`[${FanType}!]!`,
      resolve(source) {
        return Object.values(source.driver.fans)
      },
    },
    // jobQueue: {
    //   type: tql`[${JobType}!]!`,
    // },
    status: {
      type: tql`String!`,
      resolve(source) {
        return source.driver.status
      },
    },
    error: {
      type: tql`${PrinterErrorType}`,
      resolve(source) {
        return source.driver.error
      },
    },
    macroDefinitions: {
      type: tql`[${MacroDefinitionType}!]!`,
      resolve: (_source, _args, context) => {
        return Object.values(context.store.getState().macros)
      },
    },
    logEntries: {
      type: tql`[${LogEntryType}!]`,
      args: {
        level: {
          type: tql`String`,
        },
        source: {
          type: tql`String`,
        },
      },
      resolve(source, args) {
        let entries = source.log.get('entries')
        if (args.level != null) {
          entries = entries.filter(log => log.level == args.level)
        }
        if (args.source != null) {
          entries = entries.filter(log => log.source == args.source)
        }
        return entries.toArray()
      },
    },
  })
})

export default Printer
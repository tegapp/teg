import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, lifecycle } from 'recompose'
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
  CardHeader,
  Switch,
  FormControlLabel,
  Button,
} from 'material-ui'

import withCreateTask from '../../higher_order_components/withCreateTask'

const heaterFragment = `
  id
  currentTemperature
  targetTemperature
`

const subscribeToHeaters = props => params => {
  return props.heaterQuery.subscribeToMore({
    document:  gql`
      subscription heatersChanged {
        heatersChanged(printerID: "test_printer_id") {
          ${heaterFragment}
        }
      }
    `,
    variables: {
    },
  })
}

const enhance = compose(
  withCreateTask,
  graphql(
    gql`query heaterQuery {
      printer(id: "test_printer_id") {
        heaters {
          ${heaterFragment}
        }
      }
    }`,
    {
      name: 'heaterQuery',
      props: props => {
        const nextProps = {
          loading: props.heaterQuery.loading,
          subscribeToHeaters: subscribeToHeaters(props),
        }
        if (nextProps.loading) return nextProps
        const heater = props.heaterQuery.printer.heaters
          .find(({id}) => id === props.ownProps.id)
        return {
          ...nextProps,
          ...heater,
          isHeating: (heater.targetTemperature ||0) > 0,
        }
      },
    },
  ),
  lifecycle({
    componentWillMount() {
      this.props.subscribeToHeaters()
    }
  }),
)

const targetText = targetTemperature => {
  if (targetTemperature == null) return 'OFF'
  return `${targetTemperature}°C`
}

const TemperatureSection = ({
  id,
  currentTemperature,
  targetTemperature,
  isHeating,
  loading,
  createTask,
}) => {
  if (loading) return <div>Loading</div>
  const toggleEnabled = (event, val) => {
    createTask({
      macro: 'toggleHeater',
      args: { [id]: val },
    })
  }
  return (
    <div>
      <Typography type='display1'>
        {currentTemperature}°C /
        <sup style={{ fontSize: '50%' }}> {targetText(targetTemperature)}</sup>
      </Typography>
      <div style={{marginTop: -3}}>
        <FormControlLabel
          control={
            <Switch
              checked={isHeating}
              onChange={toggleEnabled}
              aria-label="heating"
            />
          }
          label={`Enable Heater`}
        />
      </div>
    </div>
  )
}

export default enhance(TemperatureSection)

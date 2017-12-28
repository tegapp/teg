import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, lifecycle } from 'recompose'
// import withSubscription from '../higher_order_components/withSubscription'

const heaterFragment = `
  id
  currentTemperature
  targetTemperature
`

const subscribeToHeaters = props => params => {
  return props.heaters.subscribeToMore({
    document:  gql`
      subscription heatersChanged {
        heatersChanged(printerID: "test_printer_id") {
          ${heaterFragment}
        }
      }
    `,
    variables: {
    },
    updateQuery: (prev, {subscriptionData}) => {
      if (!subscriptionData.data) {
          return prev
      }
      console.log('UPDATE!', prev, subscriptionData)
      return prev
      // const newFeedItem = subscriptionData.data.commentAdded
      //
      // return Object.assign({}, prev, {
      //   entry: {
      //       comments: [newFeedItem, ...prev.entry.comments]
      //   }
      // })
    }
  })
}

const enhance = compose(
  graphql(
    gql`query heaters {
      printer(id: "test_printer_id") {
        heaters {
          ${heaterFragment}
        }
      }
    }`,
    {
      name: 'heaters',
      props: props => {
        return {
          ...props.heaters.printer,
          subscribeToHeaters: subscribeToHeaters(props),
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

const HeatersStatus = ({heaters}) => {
  if (heaters == null) return <div>Loading</div>
  return (
    <div>
      <h1>Heaters</h1>
      {
        heaters.map(({
          id,
          currentTemperature,
          targetTemperature
        }) => (
          <div key={id}>
            {id}: {currentTemperature}&deg;C
            {' / '}
            {targetTemperature ? `${targetTemperature}&deg;C` : 'OFF'}
          </div>
        ))
      }
    </div>
  )
}

export default enhance(HeatersStatus)

// export default graphql(gql`query heaters {
//     printer(id: "test_printer_id") {
//       heaters {
//         ${heaterFragment}
//       }
//     }
//   }`, {
//   props: (props) => props.data.printer
// })(HeatersStatus)

import { compose, withContext } from 'recompose'
import {
  Grid,
  Typography,
} from 'material-ui'
import Loader from 'react-loader-advanced'
import PropTypes from 'prop-types'

import App from '../components/App'
// import HeatersStatus from '../components/HeatersStatus'
// import Submit from '../components/Submit'
import Log from '../components/Log'
import Home from '../components/home/Home'
import XYJogButtons from '../components/jog/XYJogButtons'
import ZJogButtons from '../components/jog/ZJogButtons'
import HeaterControl from '../components/heaters/HeaterControl'

const enhance = compose(
  withContext(
    {
      printerID: PropTypes.string,
    },
    () => ({ printerID: 'test_printer_id'}),
  ),
)

const ManualControl = props => (
  <App>
    <Grid
      container
      spacing={24}
    >
      <Loader
        show={true}
        message={
          <Typography variant="display1" style={{color: '#fff'}}>
            manual controls disabled while printing
          </Typography>
        }
        style={{
          flex: 1,
          margin: 12,
        }}
        backgroundStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
        contentStyle={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <Grid item xs={12}>
          <Home />
        </Grid>
        <Grid item xs={12} sm={8}>
          <XYJogButtons form='xyJog' />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ZJogButtons form='zJog' />
        </Grid>
      </Loader>
      <Grid item xs={12}>
        <HeaterControl id='e0' isExtruder={true} name='Extruder 1' />
      </Grid>
      <Grid item xs={12}>
        <HeaterControl id='b' isExtruder={false} name='Bed' />
      </Grid>
    </Grid>
  </App>
)

export default enhance(ManualControl)

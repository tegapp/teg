import { compose } from 'recompose'
import styled from 'styled-components'
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
import { Field, reduxForm, formValues } from 'redux-form'

import withSpoolMacro from '../../higher_order_components/withSpoolMacro'

const enhance = compose(
  withSpoolMacro,
)

const Home = ({
  spoolMacro
}) => (
  <Card>
    <CardContent>
      <div style={{ textAlign: 'right' }}>
        <Button
          raised
          onClick={() => spoolMacro({ macro: 'home', args: { all: true } })}
        >
          Home
        </Button>
      </div>
    </CardContent>
  </Card>
)

export default enhance(Home)

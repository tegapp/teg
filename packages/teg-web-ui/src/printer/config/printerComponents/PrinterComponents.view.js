import React from 'react'
import { Link } from 'react-router-dom'

import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
  Fab,
} from '@material-ui/core'

import Usb from '@material-ui/icons/Usb'
import Toys from '@material-ui/icons/Toys'
import VideoLabel from '@material-ui/icons/VideoLabel'
import Videocam from '@material-ui/icons/VideocamRounded'
import Widgets from '@material-ui/icons/Widgets'
import Waves from '@material-ui/icons/Waves'
import CompareArrows from '@material-ui/icons/CompareArrows'
import Add from '@material-ui/icons/Add'

import UpdateDialog, { UPDATE_DIALOG_FRAGMENT } from '../components/UpdateDialog/Index'
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog'
import CreateComponentDialog from '../components/CreateComponentDialog/Index'

import transformComponentSchema from './transformComponentSchema'

import useStyles from './PrinterComponents.styles'

const componentsOfType = (components, ofType) => (
  components.filter(component => component.type === ofType)
)

const CATEGORIES = [
  {
    type: 'CONTROLLER',
    heading: 'Controllers',
    Icon: Usb,
  },
  {
    type: 'AXIS',
    heading: 'Axes',
    Icon: CompareArrows,
  },
  {
    type: 'TOOLHEAD',
    heading: 'Toolheads',
    Icon: Waves,
  },
  {
    type: 'BUILD_PLATFORM',
    heading: 'Build Platform',
    Icon: VideoLabel,
  },
  {
    type: 'FAN',
    heading: 'Fans',
    Icon: Toys,
  },
  {
    type: 'VIDEO',
    heading: 'Video Sources',
    Icon: Videocam,
  },
]

const PrinterComponentsView = ({
  machineID,
  components,
  fixedListComponentTypes,
  status,
  hasPendingUpdates,
  componentID,
  selectedComponent,
  devices,
  materials,
  videoSources,
  verb,
}) => {
  const classes = useStyles()

  return (
    <main className={classes.root}>
      { componentID !== 'new' && selectedComponent != null && verb == null && (
        <UpdateDialog
          title={selectedComponent.name}
          open={selectedComponent != null}
          status={status}
          hasPendingUpdates={hasPendingUpdates}
          deleteButton={
            fixedListComponentTypes.includes(selectedComponent.type) === false
          }
          collection="COMPONENT"
          transformSchema={schema => transformComponentSchema({
            schema,
            materials,
            videoSources,
            devices,
          })}
          variables={{ machineID, componentID: selectedComponent.id }}
          query={gql`
            query($machineID: ID!, $componentID: ID) {
              machines(machineID: $machineID) {
                components(componentID: $componentID) {
                  configForm {
                    ...UpdateDialogFragment
                  }
                }
              }
            }
            ${UPDATE_DIALOG_FRAGMENT}
          `}
        />
      )}
      { selectedComponent != null && verb === 'delete' && (
        <DeleteConfirmationDialog
          type={selectedComponent.type.toLowerCase()}
          title={selectedComponent.name}
          id={selectedComponent.id}
          collection="COMPONENT"
          machineID={machineID}
          open={selectedComponent != null}
        />
      )}
      { componentID === 'new' && (
        <CreateComponentDialog
          machineID={machineID}
          open
          fixedListComponentTypes={fixedListComponentTypes}
          devices={devices}
          materials={materials}
        />
      )}
      <Tooltip title="Add Component" placement="left">
        <Fab
          disabled={hasPendingUpdates || status === 'PRINTING'}
          component={React.forwardRef((props, ref) => (
            <Link
              to={componentID === 'new' ? './' : 'new/'}
              innerRef={ref}
              style={{ textDecoration: 'none' }}
              {...props}
            />
          ))}
          className={classes.addFab}
        >
          <Add />
        </Fab>
      </Tooltip>
      <List>
        {
          CATEGORIES.map(({
            type,
            heading,
            Icon,
          }) => (
            <div key={type}>
              <ListSubheader>
                {heading}
              </ListSubheader>
              {
                componentsOfType(components, type).map(component => (
                  <ListItem
                    button
                    divider
                    key={component.id}
                    component={React.forwardRef((props, ref) => (
                      <Link
                        to={`${component.id}/`}
                        innerRef={ref}
                        {...props}
                      />
                    ))}
                  >

                    <ListItemIcon>
                      {
                        (
                          Icon && <Icon />
                        )
                        || <Widgets />
                      }
                    </ListItemIcon>
                    <ListItemText>
                      {component.name}
                    </ListItemText>
                  </ListItem>
                ))
              }
              <Divider />
            </div>
          ))
        }
      </List>
    </main>
  )
}

export default PrinterComponentsView
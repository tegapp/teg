import React from 'react'
import { storiesOf } from '@storybook/react'
import JobCard from './JobCard'

import { reprap } from '../mocks/job.mock'

storiesOf('JobCard', module)
  .add('printing multiple tasks', () => <JobCard {...reprap} />)
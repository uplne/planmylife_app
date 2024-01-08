import { useEffect } from 'react';

import { Box } from '../Box';
import { SubHeading } from '../SubHeading';
import { TasksBox } from '../TasksBox';

import './Tasks.css';

export const Tasks = () => {
  useEffect(() => {
    
  }, []);

  return (
    <TasksBox>
      <Box>
        <SubHeading title="Tasks" />
      </Box>
    </TasksBox>
  );
};
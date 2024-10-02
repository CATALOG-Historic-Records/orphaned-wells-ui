import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface ProjectTabProps {
  options: string[];
  value: number;
  setValue: (newValue: number) => void;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ProjectTabs({ options, value, setValue }: ProjectTabProps) {

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="project tabs" centered>
          {options.map((v, idx) => (
            <Tab label={options[idx]} {...a11yProps(idx)} />
          ))}
        </Tabs>
      </Box>
      
    </Box>
  );
}

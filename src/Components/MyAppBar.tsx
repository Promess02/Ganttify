import React, { useState } from 'react';
import { AppBar, Box, Button, IconButton, Select, SelectChangeEvent, MenuItem, Toolbar, Drawer, List, ListItem, ListItemText, Typography, Divider, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../styles/AppBar.css';
import MenuIcon from '@mui/icons-material/Menu';
import ProjectPicker from './ProjectPicker.tsx';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import PeopleIcon from '@mui/icons-material/People';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';
interface Project {
  project_id: number;
  project_name: string;
}

interface MyAppBarProps {
  project_name: string;
  user_email: string;
  projects: Project[];
  project_currency: string;
  onProjectSelect: (projectId: number, tasks: any[], workers: any[]) => void;
  onAddRow: () => void;
  onDeleteRow: () => void;
  onAddSubtasks: (numSubtasks: number) => void;
  onIndentRow: () => void;
  onOutdentRow: () => void;
  onHandleResources: () => void;
  onLinkResource: () => void;
  onUnlinkResource: () => void;
  onGenerateReport: () => void;
  onLogout: () => void;
  onSaveProject: () => void;
  onCreateNewProject: () => void;
  onAddTaskDescription: () => void;
  handleChangeProjectCurrency: (currency: 'USD' | 'GBP' | 'PLN' | 'EUR') => void;
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'flex-start',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),

  '@media all': {
    minHeight: 100,
  },
}));

const MyAppBar: React.FC<MyAppBarProps> = ({ project_name, user_email, projects, project_currency, onProjectSelect, onAddRow, onDeleteRow, onAddSubtasks, onIndentRow, onOutdentRow, onHandleResources, onLinkResource, onUnlinkResource, onGenerateReport, onLogout, onSaveProject, onCreateNewProject, onAddTaskDescription, handleChangeProjectCurrency }) => {
  const [numSubtasks, setNumSubtasks] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  const handleNumSubtasksChange = (event: SelectChangeEvent<number>) => {
    setNumSubtasks(event.target.value as number);
  };

  const changeCurrency = (event: SelectChangeEvent<string>) => {
    handleChangeProjectCurrency(event.target.value as 'USD' | 'GBP' | 'PLN' | 'EUR');
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const toggleProjects = () => {
    setShowProjects(!showProjects);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }

  const handleSaveProject = () => {
    onSaveProject();
    setDrawerOpen(false);
  }

  const drawerContent = (
    <Box
      sx={{
        width: 300,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
      }}
      role="presentation"
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
          User Email: <span style={{ color: '#007bff' }}>{user_email}</span>
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
          Project Name: <span style={{ color: '#007bff' }}>{project_name}</span>
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem button onClick={toggleProjects} sx={{ borderBottom: '1px solid #ccc' }}>
            <ListItemText primary={showProjects?"Hide projects":"Show all projects"} primaryTypographyProps={{ fontSize: '1rem', fontWeight: 'bold' }} />
          </ListItem>
          {showProjects && (
            <ProjectPicker projects={projects} handleCloseDrawer={handleCloseDrawer} onProjectSelect={onProjectSelect} onCreateNewProject={onCreateNewProject}/>
          )}
        </List>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
          Select project currency:
        </Typography>
        <Select
            value={project_currency}
            onChange={changeCurrency}
            sx={{ width: 100, ml: 2 }}
          >
            {['USD', 'EUR', 'PLN', 'GBP'].map(currency => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Button color='inherit' variant='outlined' onClick={handleSaveProject} startIcon={<SaveIcon />} sx={{ fontWeight: 'bold', width: '80%', BorderColor: '#1a92e7', color: '#1a92e7', padding: '15px', borderRadius: '5px' }}>Save Project</Button>
        <Button onClick={onLogout} color="inherit" variant="outlined" sx={{ fontWeight: 'bold', borderColor: '#007bff', color: '#007bff', width: '80%', mt: 2 }}>
          Log out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <StyledToolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button className='bar-buttons' color="inherit" onClick={onAddRow} startIcon={<AddIcon/>}>New Row</Button>
            <Button className='bar-buttons' color="inherit" onClick={onDeleteRow} startIcon={<DeleteIcon/>}>Delete Row</Button>
            <Button className='bar-buttons' color="inherit" onClick={() => onAddSubtasks(numSubtasks)}  startIcon={<SubdirectoryArrowRightIcon/>}>Add Subtasks</Button>
            <Select
              value={numSubtasks}
              onChange={handleNumSubtasksChange}
              sx={{ width: 60 }}
            >
              {[1, 2, 3, 4, 5].map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
             </Select>
            <Button className='bar-buttons' color="inherit" onClick={onIndentRow}  startIcon={<FormatIndentIncreaseIcon/>}>Indent Task</Button>
            <Button className='bar-buttons' color="inherit" onClick={onOutdentRow}  startIcon={<FormatIndentDecreaseIcon/>}>Outdent Task</Button>
            <Button className='bar-buttons' color="inherit" onClick={onHandleResources}  startIcon={<PeopleIcon/>}>Define Resources</Button>
            <Button className='bar-buttons' color="inherit" onClick={onLinkResource} startIcon={<LinkIcon/>}>Link Resource</Button>
            <Button className='bar-buttons' color="inherit" onClick={onUnlinkResource} startIcon={<LinkOffIcon/>}>Unlink Resource</Button>
            <Button className='bar-buttons' color="inherit" onClick={onGenerateReport} startIcon={<AssessmentIcon/>}>Generate Report</Button>
            <Button className='bar-buttons' color="inherit" onClick={onAddTaskDescription} startIcon={<DescriptionIcon/>}>Change description</Button>
          </Box>
        </StyledToolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default MyAppBar;
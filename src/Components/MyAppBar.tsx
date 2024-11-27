import React, { useState } from 'react';
import { AppBar, Box, Button, IconButton, TextField, Toolbar, Drawer, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

interface Project {
    project_id: number;
    project_name: string;
}

interface MyAppBarProps {
    project_name: string;
    user_email: string;
    projects: Project[];
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
  }

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),

    '@media all': {
      minHeight: 100,
    },
  }));

const MyAppBar: React.FC<MyAppBarProps> = ({project_name, user_email, projects, onAddRow, onDeleteRow, onAddSubtasks, onIndentRow, onOutdentRow, onHandleResources, onLinkResource, onUnlinkResource, onGenerateReport, onLogout}) => {
    const [numSubtasks, setNumSubtasks] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showProjects, setShowProjects] = useState(false);

    const handleNumSubtasksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumSubtasks(Number(event.target.value));
      };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
          return;
        }
        setDrawerOpen(open);
      };

    const handleProjectClick = (projectId: number) => {
        console.log(`Project clicked: ${projectId}`);
        // Implement project change logic here
      };

    const toggleProjects = () => {
        setShowProjects(!showProjects);
      }; 

      const drawerContent = (
        <Box
          sx={{ width: 500 }}
          role="presentation"
        >
          <Typography variant="h6" sx={{ p: 2 }}>User Email: {user_email}</Typography>
          <Typography variant="h6" sx={{ p: 2 }}>Project Name: {project_name}</Typography>
          <Divider />
          <List>
            <ListItem button onClick={toggleProjects}>
              <ListItemText primary="Show All Projects" />
            </ListItem>
            {showProjects && (
                <List>
                    {projects.map((project) => (
                        <ListItem button key={project.project_id} onClick={() => handleProjectClick(project.project_id)}>
                            <ListItemText primary={project.project_name} />
                        </ListItem>
                    ))}
                </List>
            )}
          </List>
          <Button onClick={onLogout} color='inherit'>Log out</Button>
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
            <Button color="inherit" onClick={onAddRow}>New Row</Button>
            <Button color="inherit" onClick={onDeleteRow}>Delete Row</Button>
            <Button color="inherit" onClick={()=>onAddSubtasks(numSubtasks)}>Add Subtasks</Button>
            <TextField
              type="number"
              value={numSubtasks}
              onChange={handleNumSubtasksChange}
              inputProps={{ min: 1 }}
              sx={{ width: 60 }}
            />
            <Button color="inherit" onClick={onIndentRow}>Indent Task</Button>
            <Button color="inherit" onClick={onOutdentRow}>Outdent Task</Button>
            <Button color="inherit" onClick={onHandleResources}>Define Resources</Button>
            <Button color="inherit" onClick={onLinkResource}>Link Resource</Button>
            <Button color="inherit" onClick={onUnlinkResource}>Unlink Resource</Button>
            <Button color="inherit" onClick={onGenerateReport}>Generate Report</Button>
          </Box>
      </StyledToolbar>
    </AppBar>
    <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
  </Box>
  );
};

export default MyAppBar;
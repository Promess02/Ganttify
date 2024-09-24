import React, { useState } from 'react';
import { AppBar, Box, Button, IconButton, Toolbar, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

interface MyAppBarProps {
    onAddRow: () => void;
    onDeleteRow: () => void;
    // onAddSubtasks: (numSubtasks: number) => void;
    // onIndentRow: () => void;
    // onOutdentRow: () => void;
  }

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),

    '@media all': {
      minHeight: 100,
    },
  }));

// const MyAppBar: React.FC<MyAppBarProps> = ({ onAddRow, onDeleteRow, onAddSubtasks, onIndentRow, onOutdentRow}) => {
const MyAppBar: React.FC<MyAppBarProps> = ({ onAddRow, onDeleteRow}) => {
    const [numSubtasks, setNumSubtasks] = useState(1);

    const handleNumSubtasksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumSubtasks(Number(event.target.value));
      };

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
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" onClick={onAddRow}>New Row</Button>
            <Button color="inherit" onClick={onDeleteRow}>Delete Row</Button>
            <Button color="inherit">Define Resources</Button>
            <Button color="inherit">Link Resource</Button>
            <Button color="inherit">Unlink Resource</Button>
            <Button color="inherit">Generate Report</Button>
          </Box>
      </StyledToolbar>
    </AppBar>
  </Box>
  );
};

export default MyAppBar;
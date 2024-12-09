import React, { useState} from 'react';
import { Box, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';

interface Project {
    project_id: number;
    project_name: string;
}

interface ProjectPickerProps {
    projects: Project[];
    handleCloseDrawer: () => void;
    onProjectSelect: (projectId: number, tasks: any[], workers: any[]) => void;
    onCreateNewProject: () => void;
}

const ProjectPicker: React.FC<ProjectPickerProps> = ({ projects, handleCloseDrawer, onProjectSelect, onCreateNewProject }) => {
    const [error, setError] = useState<string | null>(null);

    const handleProjectClick = async (projectId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const responseTasks = await axios.get(`/projects/${projectId}/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const responseWorkers = await axios.get(`/projects/${projectId}/workers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            onProjectSelect(projectId, responseTasks.data, responseWorkers.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCreateNewProject = () => {
        handleCloseDrawer();
        onCreateNewProject();
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto', mt: 4 }}>
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            <List>
                {projects.map((project) => (
                    <React.Fragment key={project.project_id}>
                        <ListItem button onClick={() => handleProjectClick(project.project_id)} sx={{ borderBottom: '1px solid #ccc' }}>
                            <ListItemText 
                                primary={project.project_name} 
                                primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#007bff' }} 
                            />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            <ListItem button onClick={handleCreateNewProject} sx={{ borderBottom: '1px solid #ccc' }}>
                <ListItemText primary="Create a new project" primaryTypographyProps={{ fontSize: '1rem', fontWeight: 'bold' }} />
            </ListItem>
            </List>
        </Box>
    );
};

export default ProjectPicker;
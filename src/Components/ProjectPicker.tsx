import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';

interface Project {
    project_id: number;
    project_name: string;
}

interface ProjectPickerProps {
    onProjectSelect: (projectId: number, tasks: any[]) => void;
}

const ProjectPicker: React.FC<ProjectPickerProps> = ({ onProjectSelect }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('/projects', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProjects(response.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectClick = async (projectId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`/projects/${projectId}/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onProjectSelect(projectId, response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Select a Project
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <List>
                {projects.map((project) => (
                    <ListItem button key={project.project_id} onClick={() => handleProjectClick(project.project_id)}>
                        <ListItemText primary={project.project_name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ProjectPicker;
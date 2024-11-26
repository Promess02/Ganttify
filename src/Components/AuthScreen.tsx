import React, { useState } from 'react';
import { Box, Button, TextField, Tabs, Tab } from '@mui/material';
import axios from 'axios';

interface AuthScreenProps {
    onLoginSuccess: () => void;
}

axios.defaults.baseURL = 'http://localhost:4000';

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('/login', { email, password });
            console.log(response.data);
            onLoginSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRegister = async () => {
        try {
            const response = await axios.post('/register', { email, name, surname, password });
            console.log(response.data);
            onLoginSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    const handleResetPassword = async () => {
        try {
            const response = await axios.post('/reset-password', { email, newPassword });
            console.log(response.data);
            // Handle successful password reset
        } catch (error) {
            console.error(error);
            // Handle password reset error
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto', mt: 4 }}>
            <Tabs value={tab} onChange={handleTabChange} centered>
                <Tab label="Login" />
                <Tab label="Register" />
                <Tab label="Reset Password" />
            </Tabs>
            {tab === 0 && (
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                        Login
                    </Button>
                </Box>
            )}
            {tab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Surname"
                        fullWidth
                        margin="normal"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
                        Register
                    </Button>
                </Box>
            )}
            {tab === 2 && (
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleResetPassword}>
                        Reset Password
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default AuthScreen;
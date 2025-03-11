
import React, { useState, useEffect } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Box,
    SelectChangeEvent,
} from '@mui/material';

// Enumerators for options
enum NotificationSounds {
    Alarm = 'Alarm',
    Chime = 'Chime',
    Bell = 'Bell',
}

enum BackgroundThemes {
    Light = 'Light',
    Dark = 'Dark',
    Blue = 'Blue',
    Green = 'Green',
}

export default function Settings() {
    // Local state to hold selected settings, initialize from localStorage if available
    const [notifSound, setNotifSound] = useState<NotificationSounds>(() => {
        return (localStorage.getItem('notifSound') as NotificationSounds) || NotificationSounds.Alarm;
    });
    const [bgTheme, setBgTheme] = useState<BackgroundThemes>(() => {
        return (localStorage.getItem('bgTheme') as BackgroundThemes) || BackgroundThemes.Light;
    });
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
        return localStorage.getItem('notificationsEnabled') === 'false' ? false : true;
    });

    // Persist settings changes to localStorage
    useEffect(() => {
        localStorage.setItem('notifSound', notifSound);
    }, [notifSound]);

    useEffect(() => {
        localStorage.setItem('bgTheme', bgTheme);
    }, [bgTheme]);

    useEffect(() => {
        localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
    }, [notificationsEnabled]);
    const handleSoundChange = (event: SelectChangeEvent<NotificationSounds>) => {
        setNotifSound(event.target.value as NotificationSounds);
    };
    const handleThemeChange = (event: SelectChangeEvent<BackgroundThemes>) => {
        setBgTheme(event.target.value as BackgroundThemes);
    };

    const handleToggleNotifications = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotificationsEnabled(event.target.checked);
    };

    return (
        <div className="flex items-center justify-center h-screen ">
            <Box className="p-8 rounded shadow-lg" sx={{ backgroundColor: '#ffffff', width: '90%', maxWidth: 400 }}>
                <h1 className="text-3xl font-bold mb-6 text-center text-black">Settings</h1>
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel id="notif-sound-label">Notification Sound</InputLabel>
                    <Select
                        labelId="notif-sound-label"
                        value={notifSound}
                        label="Notification Sound"
                        onChange={handleSoundChange}
                    >
                        {Object.values(NotificationSounds).map((sound, index) => (
                            <MenuItem key={index} value={sound}>
                                {sound}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel id="bg-theme-label">Background Theme</InputLabel>
                    <Select
                        labelId="bg-theme-label"
                        value={bgTheme}
                        label="Background Theme"
                        onChange={handleThemeChange}
                    >
                        {Object.values(BackgroundThemes).map((theme, index) => (
                            <MenuItem key={index} value={theme}>
                                {theme}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={
                        <Switch
                            checked={notificationsEnabled}
                            onChange={handleToggleNotifications}
                            color="primary"
                        />
                    }
                    label="Enable Notifications"
                    className="w-full text-black"
                />
            </Box>
        </div>
    );
}
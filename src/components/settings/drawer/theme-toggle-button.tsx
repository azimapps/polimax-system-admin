
import type { IconButtonProps } from '@mui/material/IconButton';

import { useCallback } from 'react';

import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

import { settingIcons } from './icons';
import { useSettingsContext } from '../context/use-settings-context';

// ----------------------------------------------------------------------

export function ThemeToggleButton({ sx, ...other }: IconButtonProps) {
    const settings = useSettingsContext();

    const { mode, setMode } = useColorScheme();

    const handleToggleTheme = useCallback(() => {
        const themeMode = mode === 'light' ? 'dark' : 'light';
        setMode(themeMode);
        settings.setState({ colorScheme: themeMode });
    }, [mode, setMode, settings]);

    return (
        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton
                onClick={handleToggleTheme}
                sx={sx}
                {...other}
            >
                <SvgIcon>
                    {mode === 'light' ? settingIcons.moon : settingIcons.sun}
                </SvgIcon>
            </IconButton>
        </Tooltip>
    );
}

import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, CssBaseline, Box, InputBase, Button } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

const Home = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="sticky" style={{ backgroundColor: '#fff', height: "75px", }}>
                <Toolbar>
                    {/* Logo Placeholder */}
                    <img src="src/assets/dmi-logo.png" alt="logo" style={{ height: '65px', margin: '10px' }} />

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#004387" }}>
                        <span >GPT-3 Powered Summary</span>

                    </Typography>
                    <Button variant="contained" color="primary">Login</Button>
                </Toolbar>
            </AppBar>
            {/* Home is considered the root, its view is persistent across all routes/pages */}
            {/* All other routes/pages will be displayed in the <Outlet /> */}
            <Outlet />
        </ThemeProvider >
    );
};

export default Home;

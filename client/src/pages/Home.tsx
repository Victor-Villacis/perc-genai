import { Link } from 'react-router-dom';
import styles from './Home.module.css';  // If you're using it
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
            <AppBar position="static" style={{ backgroundColor: '#1976d2', height: "75px" }}>
                <Toolbar>
                    {/* Logo Placeholder */}
                    <img src="src/assets/dmi-logo.png" alt="logo" style={{ height: '65px', margin: '10px' }} />

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Button variant="contained" color="primary" style={{
                            height: "76px",
                            border: "0px solid #000000",
                            borderRadius: "0px",
                            boxShadow: "none",
                            marginLeft: "25px",
                            backgroundColor: 'rgb(75 140 206)'


                        }}>
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                        </Button>
                        <Button variant="contained" color="primary" style={{
                            height: "76px",
                            border: "0px solid #000000",
                            borderRadius: "0px",
                            boxShadow: "none",
                            marginLeft: "10px",
                            backgroundColor: 'rgb(75 140 206)'

                        }}>
                            <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About</Link>
                        </Button>
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

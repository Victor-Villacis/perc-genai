import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, CssBaseline, Box, InputBase, Button } from '@mui/material';
import styled from 'styled-components';



const StyledToolbar = styled(Toolbar)`
  && {
    display: flex;
    justify-content: space-between;
  }
`;

const TitleText = styled.span`
  && {
    font-size: 1.2rem;
    background: linear-gradient(to right, #004387, #003366);
    -webkit-background-clip: text;
    color: transparent;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 5px;
    border-radius: 8px;
  }
`;


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
                <StyledToolbar>
                    <img src="src/assets/dmi-logo.png" alt="logo" style={{ height: '65px', margin: '10px' }} />
                    <TitleText>AI-Enhanced Summaries, Powered by GPT-3</TitleText>
                </StyledToolbar>
            </AppBar>
            {/* Home is considered the root, its view is persistent across all routes/pages */}
            {/* All other routes/pages will be displayed in the <Outlet /> */}
            <Outlet />
        </ThemeProvider >
    );
};

export default Home;

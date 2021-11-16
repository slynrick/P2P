import '../styles/Navbar.css';
import logo from '../logo.png'

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChainIcon from '@material-ui/icons/LinkRounded';
import AddIcon from '@material-ui/icons/Add';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function NavBar(props) {
  const [newChainName, setnewChainName] = React.useState(false);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(true);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNewChainChange = (event) => {
    setnewChainName(event.target.value);
  };

  const handleNewChainSubmit = () => {
    console.log(newChainName);
    if (newChainName === "") return;
    props.addChain(newChainName);
  }

  return (
    <Box sx={{ display: 'flex' }} >
      <AppBar position="fixed" open={open}>
        <Toolbar className="appbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
                <img className="pnx-logo-icon" src={logo} alt="Logo" />
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer  
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "#323741",
            color: "white"
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
        >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem>
            <FormControl variant="outlined"  >
              <InputLabel style={{ color: 'white' }}>New</InputLabel>
              <OutlinedInput style={{ color: 'white' }}
                id="outlined-adornment-chain"
                  onChange={handleNewChainChange}
                endAdornment={
                  
                  <InputAdornment position="end">
                    <IconButton
                         onClick={handleNewChainSubmit}
                      >
                      <AddIcon style={{ color: 'white' }}/>
                    </IconButton>
                  </InputAdornment>
                }
                label="Add"
              />
            </FormControl>
          </ListItem>
        </List>
        <Divider />
        <List>
          {props.chains.map((text, index) => (
            <ListItem button key={text}
              selected={selectedIndex === index}
              onClick={(event) => { handleListItemClick(event, index); props.selectChain(text); }}>
              <ListItemIcon>
                <ChainIcon style={{ color: 'white' }}/>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}


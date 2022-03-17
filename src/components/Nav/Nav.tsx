import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';

import ListItemLink from '../ListItemLink';
import useKeenStats from '../../hooks/useKeenStats';
import useAvaxStats from '../../hooks/useAvaxStats';
import useShareStats from '../../hooks/useiSkeenStats';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountButton from './AccountButton';

import keenLogo from '../../assets/img/keen.png';
import { roundAndFormatNumber } from '../../0x';
//import TokenSymbol from '../TokenSymbol';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: '#f9d749',
    'background-color': '#171923',
    // borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '10px',
    marginBottom: '3rem',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    fontFamily: 'Rubik',
    fontSize: '0px',
    flexGrow: 1,
  },
  link: {
    textTransform: 'uppercase',
    color: '#f9d749',
    fontSize: '18px',
    marginTop: '15px',
    margin: theme.spacing(10, 1, 1, 2),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  brandLink: {
    textDecoration: 'none',
    color: '#f9d749',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const keenStats = useKeenStats();
  const avaxStats = useAvaxStats();
  const shareStats = useShareStats();

  // const [connected, setConnected] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const avaxPriceInDollars = useMemo(() => (avaxStats ? Number(avaxStats).toFixed(2) : null), [avaxStats]);
  const keenPriceInDollars = useMemo(
    () => (keenStats ? Number(keenStats.priceInDollars).toFixed(2) : null),
    [keenStats],
  );
  const sharePriceInDollars = useMemo(
    () => (shareStats ? Number(shareStats.priceInDollars).toFixed(2) : null),
    [shareStats],
  );

  return (
    <AppBar position="sticky" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <>
            <Typography variant="h6" color="inherit" noWrap style={{ flexGrow: '0' }} className={classes.toolbarTitle}>
              {/* <a className={ classes.brandLink } href="/">Keen Money</a> */}
              <Link to="/" color="inherit" className={classes.brandLink}>
                <img alt="keen.money" src={keenLogo} height="60px" />
              </Link>
            </Typography>
            <Box style={{ paddingLeft: '15px', fontSize: '1rem', flexGrow: '1' }}>
              <Link to="/" className={'navLink ' + classes.link}>
                Home
              </Link>
              <Link to="/farm" className={'navLink ' + classes.link}>
                Spiral
              </Link>
              <Link to="/boardroom" className={'navLink ' + classes.link}>
                Galaxy
              </Link>
              <Link to="/bond" className={'navLink ' + classes.link}>
                Bond
              </Link>
              <a
                href="https://docs.ikeenfi.app"
                className={'navLink ' + classes.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                Docs
              </a>
            </Box>

            <Box
              style={{
                flexGrow: '0',
                paddingLeft: '15px',
                paddingTop: '5px',
                fontSize: '1rem',
                paddingRight: '15px',
                height: '30px',
                display: 'flex',
              }}
            ></Box>
            <AccountButton text="Connect" />
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>

            <img
              alt="keen.money"
              src={keenLogo}
              style={{ height: '40px', marginTop: '-10px', marginLeft: '10px', marginRight: '15px' }}
            />
            <AccountButton text="Connect" />
            <Drawer
              className={classes.drawer}
              onClose={handleDrawerClose}
              // onEscapeKeyDown={handleDrawerClose}
              // onBackdropClick={handleDrawerClose}
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? (
                    <ChevronRightIcon htmlColor="white" />
                  ) : (
                    <ChevronLeftIcon htmlColor="white" />
                  )}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItem>
                  <AccountButton text="Connect" />
                </ListItem>
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Spiral" to="/farm" />
                <ListItemLink primary="Galaxy" to="/boardroom" />
                <ListItemLink primary="Bond" to="/bond" />
                <ListItem button component="a" href="https://docs.ikeenfi.app">
                  <ListItemText>Documentation</ListItemText>
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Link } from '@material-ui/core';

import IconTelegram from '../../assets/img/telegram.svg';
import IconTwitter from '../../assets/img/twitter.svg';
import IconGithub from '../../assets/img/github.svg';
import IconDiscord from '../../assets/img/discord.svg';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '15px',
    paddingBottom: '15px',
    width: '100%',
    color: 'white',
    backgroundColor: '#00000',
    textAlign: 'center',
    height: '1.3rem',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  link: {
    width: '24px',
    height: '24px',
    display: 'inline',
    marginLeft: '20px',
  },

  img: {
    width: '24px',
    height: '24px',
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body2" color="textPrimary" align="left">
              {'Copyright © '}
              <Link color="red" href="/">
                iKeen Finance
              </Link>{' '}
              {new Date().getFullYear()}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right', height: '20px' }}>
            <a
              href="https://twitter.com/iKeenFinance"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img src={IconTwitter} style={{ fill: '#dddfee' }} />
            </a>
            <a href="https://github.com/ikeenfi" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img src={IconGithub} style={{ fill: '#dddfee', height: '20px' }} />
            </a>
            
            <a href="https://discord.gg/fj6B245xdR" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img src={IconDiscord} style={{ fill: '#dddfee', height: '20px' }} />
            </a>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;

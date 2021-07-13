import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AuthModal from './auth/AuthModal';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);
export default function NavBar() {
  const [openModal, setOpenModal] = useState(false);
  //const [modalType, setModalType] = useState('login');
  const classes = useStyles();
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          <Button color="inherit" onClick={() => setOpenModal(!openModal)}>
            Login
          </Button>
          <Button color="inherit" onClick={() => setOpenModal(!openModal)}>
            Signup
          </Button>
        </Toolbar>
      </AppBar>
      {openModal ? (
        <AuthModal
          onClose={handleClose}
          open={openModal}
          //type={modalType}
          //setType={setModalType}
        ></AuthModal>
      ) : null}
    </div>
  );
}

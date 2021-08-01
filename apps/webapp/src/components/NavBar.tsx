import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AuthModal from './auth/AuthModal';

import { FormType } from '@libs/shared-types';

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
  const [formType, setFormType] = useState<FormType>('login');
  const classes = useStyles();

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleOpen = (type: FormType) => {
    setFormType(type);
    setOpenModal(!openModal);
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
          <Button color="inherit" onClick={() => handleOpen('login')}>
            Login
          </Button>
          <Button color="inherit" onClick={() => handleOpen('signup')}>
            Signup
          </Button>
        </Toolbar>
      </AppBar>
      {openModal ? (
        <AuthModal
          onClose={handleClose}
          open={openModal}
          formType={formType}
          setFormType={setFormType}
        ></AuthModal>
      ) : null}
    </div>
  );
}

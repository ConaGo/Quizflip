import React, { useState } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import AuthModal from './auth/AuthModal';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  ListItemIcon,
} from '@libs/mui';
import { FormType } from '@libs/shared-types';
import Link from 'next/link';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: '1em',
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
            <Link href="/admin">
              <ListItemIcon />
            </Link>
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
          handleClose={handleClose}
          open={openModal}
          formType={formType}
          setFormType={setFormType}
        ></AuthModal>
      ) : null}
    </div>
  );
}

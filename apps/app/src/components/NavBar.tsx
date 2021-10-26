import React, { useState } from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import AuthModal from './AuthModal';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  styled,
  UnstyledLink,
} from '@libs/mui';
import { FormType } from '@libs/shared-types';
import { useAuth } from '../hooks/useAuth';
import { NavTabs } from './NavTabs';
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  })
);
export const NavBar = () => {
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

  const handleLogout = () => {
    setOpenModal(false);
    logout();
  };

  const { user, logout } = useAuth();

  interface INavButton {
    setSelected: () => void;
    route: string;
    text: string;
  }

  const NavButton = ({ setSelected, route, text }: INavButton) => {
    return (
      <Button
        onClick={setSelected}
        color="inherit"
        sx={{
          flexGrow: 1,
          boxSizing: 'content-box',
          margin: '3px',
          textTransform: 'none',
          borderBottom: 'none',
          borderRadius: '0px',
          ':hover': {
            border: 'solid 3px green',
            margin: '0px',
          },
        }}
      >
        <UnstyledLink to={route}>
          <Typography variant="h6">{text}</Typography>
        </UnstyledLink>
      </Button>
    );
  };
  const [selected, setSelected] = React.useState(0);
  const routes = [
    { route: '/play', text: 'Play' },
    { route: '/create', text: 'Create' },
    { route: '/explore', text: 'Explore' },
  ];
  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ alignItems: 'stretch' }}>
          <NavTabs routes={routes} />
          <Box sx={{ flexGrow: 5 }} />
          {user ? (
            <Button color="inherit" onClick={() => handleLogout()}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => handleOpen('login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => handleOpen('signup')}>
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      {openModal && !user ? (
        <AuthModal
          handleClose={handleClose}
          open={openModal}
          formType={formType}
          setFormType={setFormType}
        ></AuthModal>
      ) : null}
    </>
  );
};

import { useState } from 'react';
import AuthModal from './AuthModal';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { FormType } from '@libs/shared-types';
import { useAuth } from '../hooks/useAuth';
import { NavTabs } from './NavTabs';

export const NavBar = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formType, setFormType] = useState<FormType>('login');

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

import React, { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';
import axios from 'axios';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Modal from '@material-ui/core/Modal';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';

import { FormType } from '@libs/shared-types';
import { Login, Signup } from '@libs/components';

export default function AuthModal({
  onClose,
  open,
  formType,
  setFormType,
}: {
  onClose: () => void;
  open?: boolean;
  formType: FormType;
  setFormType: React.Dispatch<React.SetStateAction<FormType>>;
}) {
  return (
    <Dialog
      transitionDuration={1000}
      onClose={onClose}
      maxWidth="xs"
      open={open}
    >
      {formType === 'signup' && <Signup setFormType={setFormType}></Signup>}
      {formType === 'login' && <Login setFormType={setFormType}></Login>}
    </Dialog>
  );
}

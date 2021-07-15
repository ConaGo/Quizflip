import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
} from 'react';
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

import useAxios from 'axios-hooks';
import { DTO, signupFormData } from '@libs/shared-types';
import { ValidationError } from 'joi';

const useForm = (defaultDto: DTO) => {
  const [dto, setDto] = useState<typeof defaultDto>(defaultDto);

  //automated validation after 3 secs
  /*   let didMountRef = false; //useRef(false);
  let changedRecently = false; //useRef(false);
  useEffect(() => {
    changedRecently = true;
    setTimeout(() => {
      if (didMountRef && !changedRecently) validator();
      else didMountRef = true;
      changedRecently = false;
    }, 3000);
  }, [dto]); */
  const defaultErrors: { [x: string]: string } = {};
  for (const [key] of Object.entries(dto)) {
    defaultErrors[key] = '';
  }
  const [errors, setErrors] = useState<typeof defaultErrors>(defaultErrors);
  const [requestState, refetch] = useAxios(
    {
      method: 'post',
      url: '/auth/signup',
      data: dto,
      baseURL: 'http://localhost:3070',
    },
    { manual: true }
  );

  const handlers = getHandlers(dto, setDto);
  const validator = () => {
    const newErrors = { ...defaultErrors };
    signupFormData
      .validate(dto, {
        abortEarly: false,
      })
      .error?.details.forEach(
        (e: { path: (string | number)[]; message: string }) => {
          newErrors[e.path[0]] = e.message;
        }
      );
    setErrors(newErrors);
  };
  const onSubmit = () =>
    setTimeout(() => {
      validator();
    }, 1000);
  return { handlers, validator, errors, onSubmit, requestState };
};

export default useForm;

type Handler = (e: ChangeEvent<HTMLInputElement>) => void;
const getHandlers = (
  obj: DTO,
  setter: Dispatch<SetStateAction<DTO>>
): Record<string, Handler> => {
  const handlers: { [key: string]: Handler } = {};
  for (const [key] of Object.entries(obj)) {
    handlers[key] = getHandler(key, obj, setter);
  }
  return handlers;
};

const getHandler = (
  name: string,
  obj: DTO,
  setter: Dispatch<SetStateAction<DTO>>
): ((e: ChangeEvent<HTMLInputElement>) => void) => {
  return (e) => setter({ ...obj, [name]: e.target.value });
};

const capitalize = (string: string): string => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

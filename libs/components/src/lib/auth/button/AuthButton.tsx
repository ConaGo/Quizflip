import React, { FC } from 'react';
import clsx from 'clsx';
import { Button, Icon, CircularProgress, Fab } from '@material-ui/core';
import { green, red, blue } from '@material-ui/core/colors';
import GitHubIcon from '@material-ui/icons/GitHub';
import CheckIcon from '@material-ui/icons/check';
import CloseIcon from '@material-ui/icons/close';

import {
  useTheme,
  createStyles,
  Theme,
  makeStyles,
} from '@material-ui/core/styles';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '5.2em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    root: {
      height: '3.2em',
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      margin: '10px auto',
      borderRadius: '25px',
      padding: '10px 20px',
    },
    google: {
      background: 'white',
    },
    github: {
      background: 'white',
    },
    default: {
      //display: 'block',
      width: '100%',
      opacity: 0.9,
      background:
        'linear-gradient(60deg, ' +
        theme.palette.primary.main +
        ' 0%, ' +
        theme.palette.secondary.main +
        ' 40%, ' +
        theme.palette.secondary.main +
        ' 60%, ' +
        theme.palette.primary.main +
        ' 100%)',
      color: 'white',
      //transition: 'opacity 0.5s',
      transition: 'width 0.5s, height 0.3s',
      '&:hover': {
        opacity: 1,
      },
    },
    img: {
      float: 'left',
      margin: 'auto',
    },
    buttonSuccess: {
      background: green[500],
    },
    buttonLoading: {
      borderRadius: '50%',
      width: '0em',
      height: '4.2em',
    },
    buttonFail: {
      background: red[900],
    },
    buttonProgress: {
      color: theme.palette.secondary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -35,
      marginLeft: -35,
    },
  })
);
interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fail?: boolean;
  success?: boolean;
  isLoading?: boolean;
  isFailed?: boolean;
  isSuccess?: boolean;
  className?: string;
  socialType?: string;
  children?: React.ReactNode;
}
const AuthButton: FC<AuthButtonProps & React.HTMLProps<HTMLButtonElement>> = ({
  isFailed = false,
  isSuccess = false,
  isLoading,
  className,
  socialType,
  children,
  onClick,
}) => {
  const _classes = useStyles();
  const buttonClassname = clsx({
    [_classes.buttonLoading]: isLoading || isSuccess || isFailed,
    [_classes.buttonSuccess]: isSuccess,
    [_classes.buttonFail]: isFailed,
  });
  let css;
  let icon;
  const variant: 'text' | 'contained' | 'outlined' = 'contained';
  switch (socialType) {
    case 'google':
      css = _classes.google;
      icon = (
        <Icon>
          <img src="google-icon.svg" alt="G" className={_classes.img}></img>
        </Icon>
      );
      break;
    case 'github':
      css = _classes.github;
      icon = <GitHubIcon></GitHubIcon>;
      break;
    default:
      css = _classes.default;
  }
  const renderContent = (children: React.ReactNode) => {
    if (isLoading)
      return <CircularProgress size={70} className={_classes.buttonProgress} />;
    if (isSuccess) return <CheckIcon fontSize="large"></CheckIcon>;
    if (isFailed) return <CloseIcon fontSize="large"></CloseIcon>;
    return children;
  };
  return (
    <div className={!socialType ? _classes.container : ''}>
      <Button
        variant="contained"
        startIcon={icon}
        className={clsx(_classes.root, css, className, buttonClassname)}
        fullWidth={!!socialType}
        onClick={onClick}
      >
        {renderContent(children)}
      </Button>
    </div>
  );
};
export default AuthButton;

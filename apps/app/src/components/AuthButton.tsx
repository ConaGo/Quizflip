import React, { FC } from 'react';
import clsx from 'clsx';
import { Button, CircularProgress, Fab } from '@libs/mui';
import { GitHub, Check, Close } from '@libs/mui/icons';
import { useTheme, createStyles, makeStyles, DefaultTheme } from '@mui/styles';
import { Icon } from '@iconify/react';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '5.2em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    root: {
      height: '3.2em',
      //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      margin: '10px auto',
      borderRadius: '25px',
      padding: '10px 20px',
    },
    google: {
      background: 'white',
      color: 'black',
      '&:hover': {
        color: 'white',
      },
    },
    github: {
      background: 'white',
      color: 'black',
      '&:hover': {
        color: 'white',
      },
    },
    default: {
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
      transition: 'opacity 0.5s, width 0.5s, height 0.3s, background 0.3s',
      '&:hover': {
        opacity: 1,
      },
    },
    img: {
      float: 'left',
      margin: 'auto',
    },
    buttonSuccess: {
      background: theme.palette.success.main,
    },
    buttonLoading: {
      borderRadius: '50%',
      width: '0em',
      height: '4.2em',
    },
    buttonFail: {
      background: theme.palette.error.main,
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
export const AuthButton: FC<
  AuthButtonProps & React.HTMLProps<HTMLButtonElement>
> = ({
  isFailed = false,
  isSuccess = false,
  isLoading,
  className,
  socialType,
  children,
  onClick,
  href,
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
      icon = <Icon icon="akar-icons:google-contained-fill" />;
      break;
    case 'github':
      css = _classes.github;
      icon = <GitHub></GitHub>;
      break;
    default:
      css = _classes.default;
  }
  const renderContent = (children: React.ReactNode) => {
    if (isLoading)
      return <CircularProgress size={70} className={_classes.buttonProgress} />;
    if (isSuccess) return <Check fontSize="large"></Check>;
    if (isFailed) return <Close fontSize="large"></Close>;
    return children;
  };
  return (
    <div className={!socialType ? _classes.container : ''}>
      <Button
        sx={{
          height: '3.2em',
          margin: '10px auto',
          borderRadius: '25px',
          padding: '10px 20px',
          transition: 'opacity 0.5s, width 0.5s, height 0.3s, background 0.3s',
        }}
        variant="contained"
        startIcon={icon}
        className={clsx(_classes.root, css, className, buttonClassname)}
        fullWidth={!!socialType}
        onClick={onClick}
        href={href}
      >
        {renderContent(children)}
      </Button>
    </div>
  );
};

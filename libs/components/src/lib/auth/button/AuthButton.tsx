import React, { FC } from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import GitHubIcon from '@material-ui/icons/GitHub';
import {
  useTheme,
  createStyles,
  Theme,
  makeStyles,
} from '@material-ui/core/styles';
import BounceLoader from 'react-spinners/BounceLoader';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
      transition: 'opacity 0.5s',
      '&:hover': {
        opacity: 1,
      },
    },
    img: {
      float: 'left',
      margin: 'auto',
    },
  })
);
interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  className?: string;
  socialType?: string;
  children?: React.ReactNode;
}
const AuthButton: FC<AuthButtonProps & React.HTMLProps<HTMLButtonElement>> = ({
  isLoading,
  className,
  socialType,
  children,
  onClick,
}) => {
  const _classes = useStyles();
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
  return (
    <Button
      variant="contained"
      startIcon={icon}
      className={clsx(_classes.root, css, className)}
      fullWidth={true}
      onClick={onClick}
    >
      {isLoading ? <BounceLoader></BounceLoader> : children}
    </Button>
  );
};
export default AuthButton;

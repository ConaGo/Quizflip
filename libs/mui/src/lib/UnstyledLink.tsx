import { styled } from '@mui/styles';
import { Link, LinkProps } from 'react-router-dom';

export const UnstyledLink = styled((props: LinkProps) => <Link {...props} />)({
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    textDecoration: 'none',
  },
  '&:visited': {
    textDecoration: 'none',
  },
  '&:link': {
    textDecoration: 'none',
  },
  '&:active': {
    textDecoration: 'none',
  },
});

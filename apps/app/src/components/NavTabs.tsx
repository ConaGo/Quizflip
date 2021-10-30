import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Typography, Button, Tabs, Tab } from '@mui/material';

import { UnstyledLink } from '@libs/mui';

interface INavButton {
  setSelected: (route: string) => void;
  route: string;
  text: string;
  children?: React.ReactNode;
}

interface IRoutes {
  route: string;
  text: string;
}
interface INavTabs {
  routes: IRoutes[];
}
const NavButton = ({ setSelected, route, text, children }: INavButton) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const isSelected = pathname === route;
  const sx = isSelected
    ? {
        backgroundColor: 'rgba(0,0,0,0.3)',
        flexGrow: 1,
        boxSizing: 'content-box',
        margin: '3px',
        textTransform: 'none',
        borderRadius: '0px',
      }
    : {
        flexGrow: 1,
        boxSizing: 'content-box',
        margin: '3px',
        textTransform: 'none',
        borderRadius: '0px',
        ':hover': {
          border: 'solid 3px green',
          margin: '0px',
        },
      };
  return (
    <Button
      onClick={() => {
        setSelected(route);
        history.push(route);
      }}
      color="inherit"
      sx={sx}
    >
      {children}

      <Typography variant="h6">{text}</Typography>
    </Button>
  );
};
function NavTabs({ routes }: INavTabs) {
  const { pathname } = useLocation();

  const [selected, setSelected] = useState(
    routes.findIndex((e) => e.route === pathname)
  );
  const customSetSelected = (route: string) => {
    setSelected(routes.findIndex((e) => e.route === route));
  };
  return (
    <Tabs
      value={selected}
      sx={{
        flexGrow: 1,
        '& .MuiTabs-flexContainer': { height: '100%' },
        '& .MuiTabs-indicator': {
          opacity: '90%',
          height: '6px',
          borderRadius: '50% 50% 0 0',
        },
      }}
    >
      {routes?.map(({ route, text }, i) => (
        <Tab
          key={i}
          component={React.forwardRef((props, ref) => (
            <NavButton
              setSelected={customSetSelected}
              route={route}
              text={text}
              {...props}
            />
          ))}
        />
      ))}
    </Tabs>
  );
}

export { NavTabs };

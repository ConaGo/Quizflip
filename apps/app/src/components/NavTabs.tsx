import { useState } from 'react';

import { Typography, Button, Tabs, Tab } from '@mui/material';

import { UnstyledLink } from '@libs/mui';

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
interface IRoutes {
  route: string;
  text: string;
}
interface INavTabs {
  routes: IRoutes[];
}
const NavTabs = ({ routes }: INavTabs) => {
  const [selected, setSelected] = useState(0);
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
          component={() =>
            NavButton({
              setSelected: () => setSelected(i),
              route: route,
              text: text,
            })
          }
        />
      ))}
    </Tabs>
  );
};

export { NavTabs };

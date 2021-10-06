import { Box } from '@material-ui/core';
import { ReactNode } from 'react';

interface ICenterBox {
  children: ReactNode;
}

const CenterBox = ({ children }: ICenterBox) => {
  return (
    <Box display="flex" justifyContent="center">
      {children}
    </Box>
  );
};

export { CenterBox };

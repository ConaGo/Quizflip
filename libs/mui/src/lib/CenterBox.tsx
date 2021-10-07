import { Box } from '../index';
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

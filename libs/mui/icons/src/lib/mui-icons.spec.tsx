import { render } from '@testing-library/react';

import MuiIcons from './mui-icons';

describe('MuiIcons', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MuiIcons />);
    expect(baseElement).toBeTruthy();
  });
});

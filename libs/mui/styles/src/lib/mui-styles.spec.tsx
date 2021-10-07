import { render } from '@testing-library/react';

import MuiStyles from './mui-styles';

describe('MuiStyles', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MuiStyles />);
    expect(baseElement).toBeTruthy();
  });
});

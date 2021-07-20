import { useState } from 'react';
import { render } from '@testing-library/react';

import Login from './login';
import { FormType } from '@libs/shared-types';

function TestComponent() {
  const [formType, setFormType] = useState<FormType>('signup');
  return <Login setFormType={setFormType}></Login>;
}
describe('Login', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TestComponent />);
    expect(baseElement).toBeTruthy();
  });
});

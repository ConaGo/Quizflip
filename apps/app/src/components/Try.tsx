/* import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

export const Try = () => {
  const [one] = useLocalStorage('i', 0);
  return <button onClick={() => writeStorage('i', one + 1)}>{one}</button>;
};
 */

import { useLocation } from 'react-router-dom';
export const Try = () => {
  const location = useLocation();
  console.log(location);
  return <div>{location.pathname}</div>;
};

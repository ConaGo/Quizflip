import { useEffect, useState } from 'react';

//This endpoint is used to transfer the jwt from the backend to
//the frontend via cookies; The jwt gets extracted and  the cookie
//immediately deleted
const AuthFlow = () => {
  const [cookie, setCookie] = useState('');
  useEffect(() => {
    //Getting the jwt
    document.cookie.split(';').forEach((c) => {
      const [key, val] = c.trim().split('=').map(decodeURIComponent);
      if (key === 'jwt') setCookie(val);
    });
    //reset cookie to null
    document.cookie = 'jwt=';
  }, []);

  return <p>{cookie}</p>;
};
export default AuthFlow;

//Reading all cookies into object
/*
document.cookie.split(';').reduce((res, c) => {
  const [key, val] = c.trim().split('=').map(decodeURIComponent);
  try {
    return Object.assign(res, { [key]: JSON.parse(val) });
  } catch (e) {
    return Object.assign(res, { [key]: val });
  }
});
*/

//Return single key
//more performance but harder to read
/*
JSON.stringify(
  document.cookie.replace(
    /(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  )
)
*/

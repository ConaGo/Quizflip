import { useEffect, useState } from 'react';

const AuthFlow = () => {
  useEffect(() => {
    // get the URL parameters which will include the auth token
    //const params = window.location.search;
    const params = new URL(String(window.location)).searchParams;
    console.log(params.get('user'));
    if (window.opener) {
      // send them to the opening window
      window.opener.postMessage(params.get('user'));
      // close the popup
      window.close();
    }
  });
  // some text to show the user
  return <p>Please wait...</p>;
};
export default AuthFlow;

/* const AuthFlow = () => {
  const [jwt, setJwt] = useState('');
  useEffect(() => {
    //Getting the jwt
    document.cookie.split(';').forEach((c) => {
      const [key, val] = c.trim().split('=').map(decodeURIComponent);
      if (key === 'jwt') setJwt(val);
    });
    //reset cookie to null
    document.cookie = 'jwt=';
  }, []);

  return <p>{jwt}</p>;
};
export default AuthFlow; */

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
//better performance but harder to read
/*
JSON.stringify(
  document.cookie.replace(
    /(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  )
)
*/

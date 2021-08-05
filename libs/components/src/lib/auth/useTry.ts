import axios from 'axios';
import { useState } from 'react';
const useTry = () => {
  const [i, setI] = useState(true);
  const submittter = async () => {
    try {
      /*       const response3 = await axios({
        method: 'post',
        url: '/auth/',
        data: { f: 'd' },
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        baseURL: 'http://10.0.2.2:3070',
      }); */
      fetch('http://localhost:3070');
      console.log('success');
      setI(false);
      //console.log(response3);
    } catch (err) {
      console.log(err);
    }

    setI(false);
    console.log(i);
  };
  return { submittter, i };
};

export default useTry;

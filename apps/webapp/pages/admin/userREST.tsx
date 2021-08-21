import { Typography, Button } from '@material-ui/core';
import Link from 'next/link';

import useAxios from 'axios-hooks';
import axios from 'axios';
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await axios({
    method: 'get',
    url: '/user/',
  });
  const ssrData = res.data;
  // Pass data to the page via props
  return { props: { ssrData } };
}
const UserOverview = ({ ssrData }) => {
  let actualData = ssrData;
  const [{ data, loading, error }, refetch] = useAxios(
    {
      method: 'get',
      url: '/user/',
      baseURL: 'http://localhost:3070',
    },
    { manual: true }
  );
  const clickHandler = () => {
    refetch();
    actualData = data;
    console.log(data);
  };

  console.log(ssrData);
  console.log(process.env);
  return (
    <>
      <button onClick={clickHandler}>Refetch Users</button>
      <ul>
        {actualData &&
          actualData.map((user) => {
            return (
              <li key={user.email}>
                {user.email}
                {',  '}
                {user.name}
                <DeleteButton
                  email={user.email}
                  onClick={refetch}
                ></DeleteButton>
              </li>
            );
          })}
      </ul>
    </>
  );
};
interface DeleteButtonProps {
  email: string;
  onClick: () => void;
}
const DeleteButton = ({ email, onClick }: DeleteButtonProps) => {
  const [{ data, loading, error }, refetch] = useAxios(
    {
      method: 'delete',
      url: '/user',
      baseURL: 'http://localhost:3070',
      params: {
        email: email,
      },
    },
    { manual: true }
  );
  const handleDelete = async () => {
    try {
      await refetch();
    } catch (err) {
      console.log(err);
    }
    onClick();
  };
  return (
    <button onClick={handleDelete}>
      {loading ? 'loading...' : 'delete'} {!!error && error.message}
    </button>
  );
};
export default UserOverview;

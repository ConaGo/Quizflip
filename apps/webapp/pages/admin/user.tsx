import { Typography, Button } from '@material-ui/core';
import Link from 'next/link';
import {
  GET_ALL_USERS,
  GET_USER,
  client,
  DELETE_USER_BY_EMAIL,
} from '@libs/data-access';
import {
  ApolloError,
  DocumentNode,
  useMutation,
  useQuery,
  useLazyQuery,
} from '@apollo/client';

export async function getServerSideProps() {
  // Fetch data from external API
  const { data } = await client.query({ query: GET_ALL_USERS });

  const ssrData = data;
  // Pass data to the page via props
  return { props: { ssrData } };
}
const UserOverview = ({ ssrData }) => {
  console.log(ssrData);
  const [getUsers, getUsersState] = useLazyQuery(GET_ALL_USERS);
  let { users } = ssrData;

  const clickHandler = () => {
    getUsers();
    users = getUsersState.data;
  };
  return (
    <>
      <button onClick={clickHandler}>Refetch Users</button>
      <ul>
        {users &&
          users.map((user) => {
            return (
              <li key={user.email}>
                {user.id}
                {',  '}
                {user.email}
                {',  '}
                {user.name}
                <DeleteButton
                  email={user.email}
                  onClick={getUsers}
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
  const [
    deleteUser,
    { loading, data, error },
  ] = useMutation(DELETE_USER_BY_EMAIL, { variables: { email: email } });
  const handleDelete = async () => {
    try {
      await deleteUser();
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

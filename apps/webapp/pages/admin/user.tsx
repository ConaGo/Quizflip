import useAxios from 'axios-hooks';
import axios from 'axios';
const UserOverview = () => {
  const [{ data, loading, error }, refetch] = useAxios({
    method: 'get',
    url: '/user/',
    baseURL: 'http://localhost:3070',
  });
  const clickHandler = () => {
    refetch();
    console.log(data);
  };

  console.log(data);
  return (
    <>
      <button onClick={clickHandler}></button>
      <ul>
        {data &&
          data.map((user) => {
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

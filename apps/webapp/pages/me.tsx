import useAxios from 'axios-hooks';
import axios from 'axios';

const UserOverview = () => {
  const [{ data, loading, error }, refetch] = useAxios({
    method: 'get',
    url: '/user/me',
    baseURL: 'http://localhost:3070',
    withCredentials: true,
  });
  const clickHandler = () => {
    refetch();
  };
  const renderContent = () => {
    if (loading) return 'loading..';
    else if (error) return 'ERROR';
    else if (data) return data.name;
  };
  return (
    <>
      <button onClick={clickHandler}>Click me Pls</button>
      <ul>{renderContent()}</ul>
    </>
  );
};
export default UserOverview;

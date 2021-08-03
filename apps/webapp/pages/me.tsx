import useAxios from 'axios-hooks';
import axios from 'axios';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
const UserOverview = () => {
  const { isLoading, error, data, refetch } = useQuery('userData', () =>
    axios({
      method: 'get',
      url: '/user/me',
      baseURL: 'http://localhost:3070',
      withCredentials: true,
    })
  );
  const clickHandler = () => {
    refetch();
  };
  const renderContent = () => {
    if (isLoading) return 'loading..';
    else if (error) return 'ERROR';
    else if (data) return data.data.name;
  };
  return (
    <>
      <button onClick={clickHandler}>Click me Pls</button>
      <ul>{renderContent()}</ul>
    </>
  );
};
export default UserOverview;

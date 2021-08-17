import { Typography, Button } from '@material-ui/core';
import Link from 'next/link';
const AdminPanel = () => {
  return (
    <>
      <Typography variant="h1" component="h2">
        AdminPanel
      </Typography>
      <Button>
        <Link href="/admin/user">user</Link>
      </Button>
      <Button>
        <Link href="/admin/question">question</Link>
      </Button>
    </>
  );
};
export default AdminPanel;

import { QuestionAdmin } from '../../components/admin/questionAdmin';
import { Typography, Button } from '@material-ui/core';
import Link from 'next/link';

const QuestionDashboard = () => {
  return (
    <>
      <Button>
        <Link href="/admin/user">user</Link>
      </Button>
      <Button>
        <Link href="/admin/question">question</Link>
      </Button>
      <QuestionAdmin></QuestionAdmin>
    </>
  );
};

export default QuestionDashboard;

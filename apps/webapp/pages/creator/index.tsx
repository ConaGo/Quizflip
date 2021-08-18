import { QuestionForm } from '../../src/components/creator/QuestionForm';
import { GetServerSideProps } from 'next';

export async function getServerSideProps() {
  const categorys = 's';
}

const CreatorHub = () => {
  return <QuestionForm></QuestionForm>;
};
export default CreatorHub;

import { QuestionForm } from '../../src/components/creator/QuestionForm';
import { GetServerSideProps } from 'next';
import { CREATE_QUESTION, client, GET_ALL_CATEGORIES } from '@libs/data-access';
import { useQuery, useMutation, gql } from '@apollo/client';

export async function getServerSideProps() {
  const { data } = await client.query({
    query: gql`
      query Categories {
        categories
      }
    `,
  });
  return { props: { categories: data.categories } };
}
interface CreatorHubProps {
  categories: string[];
}
const CreatorHub = ({ categories }: CreatorHubProps) => {
  return <QuestionForm categories={categories}></QuestionForm>;
};
export default CreatorHub;

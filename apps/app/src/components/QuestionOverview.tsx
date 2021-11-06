import { useState } from 'react';
import { useQuery } from 'react-query';
import { GET_USER_QUESTIONS } from '@libs/data-access';
import axios from '../hooks/axios';
import { useAuth } from '../hooks/useAuth';
import {
  CreateQuestionDto,
  QuestionDto,
  QuestionType,
} from '@libs/shared-types';
import { TreeView, TreeItem } from '@mui/lab';
//import { ExpandMoreIcon, ChevronRightIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { unescape } from '../util/util';
type SortByDate = 'dateNew' | 'dateOld';
type SortBy = 'nothing' | 'categories' | 'tags';
export const QuestionOverview = () => {
  const [sortByDate, setSortByDate] = useState<SortByDate>('dateNew');
  const [sortBy, setSortBy] = useState<SortBy>('nothing');
  const { data, error, isError, isLoading } = useQuery(
    'user_questions',
    async () =>
      axios.post('/graphql', {
        query: GET_USER_QUESTIONS,
      })
  );
  console.log(data);
  console.log(data?.data.data.userQuestions);
  console.log(data?.data.length > 0);
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (data?.data?.errors) {
    return <span>Error: {data?.data?.errors[0]?.message}</span>;
  }

  if (!data) {
    return null;
  }

  const questions = data.data.data.userQuestions as QuestionDto[];
  let sortedByCategory: Record<string, QuestionDto[]> = {};
  for (const question of questions) {
    // eslint-disable-next-line no-prototype-builtins
    if (!sortedByCategory.hasOwnProperty(question.category)) {
      sortedByCategory[question.category] = [question];
    } else {
      sortedByCategory[question.category].push(question);
    }
  }
  for (const category in sortedByCategory) {
    sortedByCategory[category].sort();
  }
  sortedByCategory = sortObjectKeys(sortedByCategory);
  return (
    <>
      {' '}
      <QuestionTree questions={questions.slice(0, 20)} />
      <CategoryQuestionTree categories={sortedByCategory} />
    </>
  );
};

const QuestionTree = ({ questions }: { questions: QuestionDto[] }) => {
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {questions.map((question: QuestionDto) => (
        <TreeItem
          nodeId={String(question.id)}
          label={
            unescape(question.question).slice(0, 40) +
            (question.question.length > 40 ? '...' : '')
          }
        />
      ))}
    </TreeView>
  );
};
const CategoryQuestionTree = ({
  categories,
}: {
  categories: Record<string, QuestionDto[]>;
}) => {
  const keys: string[] = Object.keys(categories).sort();
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {keys.map((category: string) => (
        <TreeItem nodeId={category}>
          {categories[category].map((question) => (
            <TreeItem
              nodeId={String(question.id)}
              label={
                unescape(question.question).slice(0, 40) +
                (question.question.length > 40 ? '...' : '')
              }
            />
          ))}
        </TreeItem>
      ))}
    </TreeView>
  );
};

function sortObjectKeys<T>(unordered: Record<string, T>): Record<string, T> {
  return Object.keys(unordered)
    .sort()
    .reduce((obj: Record<string, T>, key: string) => {
      obj[key] = unordered[key];
      return obj;
    }, {});
}

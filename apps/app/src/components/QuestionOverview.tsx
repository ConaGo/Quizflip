import { useState } from 'react';
import { useQuery } from 'react-query';
import { GET_USER_QUESTIONS } from '@libs/data-access';
import axios from '../hooks/axios';
import { CreateQuestionDto, QuestionType } from '@libs/shared-types';
import { TreeView, TreeItem } from '@mui/lab';
//import { ExpandMoreIcon, ChevronRightIcon } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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

  const questions = data.data.data.userQuestions as CreateQuestionDto[];
  const sortedByCategory: Record<string, CreateQuestionDto[]> = {};
  for (const question of questions) {
    // eslint-disable-next-line no-prototype-builtins
    if (sortedByCategory.hasOwnProperty(question.category)) {
      sortedByCategory[question.category] = [question];
    } else {
      sortedByCategory[question.category].push(question);
    }
  }
  for (const category in sortedByCategory) {
    sortedByCategory[category].sort();
  }
  return (
    <>
      {questions.length > 0
        ? data?.data?.data?.userQuestions.map((question: any) => (
            <p>{question.question}</p>
          ))
        : ''}
    </>
  );
};

const questionTree = ({ questions }: { questions: any }) => {
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {questions.map((question: any) => (
        <p>{question.question}</p>
      ))}
      <TreeItem nodeId="1" label="Applications">
        <TreeItem nodeId="2" label="Calendar" />
      </TreeItem>
      <TreeItem nodeId="5" label="Documents">
        <TreeItem nodeId="10" label="OSS" />
        <TreeItem nodeId="6" label="MUI">
          <TreeItem nodeId="8" label="index.js" />
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
};

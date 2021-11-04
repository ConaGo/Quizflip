import { Dispatch, SetStateAction, useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  MenuItem,
  Theme,
  Chip,
  Paper,
  Grid,
  RadioGroup,
  Radio,
  FormControlLabel,
  Menu,
  IconButton,
  Tabs,
  Tab,
  Autocomplete,
  Box,
  Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { makeStyles, createStyles, ClassNameMap } from '@mui/styles';
import { Add, Save } from '@mui/icons-material';
import { CenterBox } from '@libs/mui';
import {
  tagsValidator,
  createQuestionFormData,
  CreateQuestionDto,
  AQuestionDifficulty,
  QuestionType,
  AQuestionType,
} from '@libs/shared-types';
import {
  CREATE_QUESTION,
  Handler,
  ErrorObject,
  HandlerObject,
} from '@libs/data-access';
import { useFormPersist } from '../hooks/useFormPersist';
import { QueryClient, useQueryClient } from 'react-query';
interface QuestionFormProps {
  categories: string[];
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    chip: {
      margin: theme.spacing(0.1),
    },
    noPadding: {
      padding: 0,
    },
    //positiones label a bit further down when input is filled or the user types
    //this prevents it from getting cut off
    popoverLabel: {
      '&.Mui-focused': {
        position: 'absolute',
        top: '0.3rem',
      },
      '&.MuiFormLabel-filled': {
        position: 'absolute',
        top: '0.3rem',
      },
    },
    //position errortext inside the input field
    helperText: {
      '& p': {
        position: 'absolute',
        bottom: '0.1rem',
      },
    },
    container: {
      display: 'flex',

      justifyContent: 'center',
      overflow: 'hidden',
    },
  })
);

export const QuestionForm = ({ categories }: QuestionFormProps) => {
  const queryClient = useQueryClient();
  const classes = useStyles();

  const [type, setType] = useState<QuestionType>('multiple');

  const handleTypeChange = (event: React.SyntheticEvent, newIndex: number) => {
    const newType = AQuestionType[newIndex];
    setType(newType);
  };

  return (
    <Paper sx={{}} elevation={10} className={classes.paper}>
      {/*       <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
        }}
      > */}
      <Stack justifyContent="center" alignItems="center">
        <CenterBox>
          <Typography variant="h4">Create A New Question</Typography>
        </CenterBox>
        <Tabs
          value={AQuestionType.indexOf(type)}
          onChange={handleTypeChange}
          aria-label="question-type-tab-select"
        >
          <Tab label="True Or False" {...a11yProps(1)} />
          <Tab label="Multiple Choice" {...a11yProps(0)} />
        </Tabs>
        {formTypeSwitch({ categories, queryClient, type })}
        {/*       </Box> */}
      </Stack>
    </Paper>
  );
};
interface ICustomLoadingButton {
  text?: string;
  error: any;
  data: unknown;
  loading: boolean;
  onSubmit: () => Promise<void>;
}
const CustomLoadingButton = ({
  text = 'Submit Question',
  error,
  data,
  loading,
  onSubmit,
}: ICustomLoadingButton) => {
  return (
    <LoadingButton
      variant="contained"
      color={error ? 'error' : data ? 'success' : 'secondary'}
      loadingPosition="start"
      loading={loading}
      onClick={onSubmit}
      startIcon={<Save />}
    >
      {error ? 'Try Again' : text}
    </LoadingButton>
  );
};

interface IQuestionForm {
  categories: string[];
  queryClient: QueryClient;
}
const MultipleChoiceForm = ({ categories, queryClient }: IQuestionForm) => {
  const localStorageKey = 'question_form_multiple';
  const defaultValues: CreateQuestionDto = {
    type: 'multiple',
    category: categories.length > 0 ? categories[0] : '',
    tags: [],
    difficulty: 'medium',
    question: '',
    correctAnswers: [''],
    incorrectAnswers: ['', '', ''],
    language: 'english',
  };

  const {
    setDto,
    dto,
    handlers,
    onSubmit,
    errors,
    loading,
    error,
    data,
  } = useFormPersist({
    defaultDto: defaultValues,
    validationObject: createQuestionFormData,
    mutation: CREATE_QUESTION,
    storageKey: localStorageKey,
    onSuccess: () => {
      setDto(defaultValues);
      queryClient.invalidateQueries('user_questions');
      console.log('great success');
    },
    onError: () => console.log('great failure'),
  });
  const inputProps: InputProps = {
    setDto,
    dto,
    handlers,
    errors,
    categories,
  };
  return (
    <>
      <QuestionInput {...inputProps}></QuestionInput>
      <MultipleChoiceInput {...inputProps} />;
      <CategoryInput {...inputProps} />
      <DifficultyInput {...inputProps} />
      <TagsInput {...inputProps} />
      <CustomLoadingButton
        error={error}
        data={data}
        loading={loading}
        onSubmit={onSubmit}
      />
    </>
  );
};
const BooleanForm = ({ categories, queryClient }: IQuestionForm) => {
  const localStorageKey = 'question_form_boolean';
  const defaultValues: CreateQuestionDto = {
    type: 'boolean',
    category: categories.length > 0 ? categories[0] : '',
    tags: [],
    difficulty: 'medium',
    question: '',
    correctAnswers: ['True'],
    incorrectAnswers: ['False'],
    language: 'english',
  };

  const {
    setDto,
    dto,
    handlers,
    onSubmit,
    errors,
    loading,
    error,
    data,
  } = useFormPersist({
    defaultDto: defaultValues,
    validationObject: createQuestionFormData,
    mutation: CREATE_QUESTION,
    storageKey: localStorageKey,
    onSuccess: () => {
      setDto(defaultValues);
      queryClient.invalidateQueries('user_questions');
      console.log('great success');
    },
    onError: () => console.log('great failure'),
  });
  const inputProps: InputProps = {
    setDto,
    dto,
    handlers,
    errors,
    categories,
  };
  return (
    <>
      <QuestionInput {...inputProps}></QuestionInput>
      <BooleanInput {...inputProps} />
      <CategoryInput {...inputProps} />
      <DifficultyInput {...inputProps} />
      <TagsInput {...inputProps} />
      <CustomLoadingButton
        error={error}
        data={data}
        loading={loading}
        onSubmit={onSubmit}
      />
    </>
  );
};
const formTypeSwitch = ({
  categories,
  queryClient,
  type,
}: IQuestionForm & { type: QuestionType }) => {
  const props = { categories, queryClient };
  switch (type) {
    case 'multiple':
      return <MultipleChoiceForm {...props} />;
    case 'boolean':
      return <BooleanForm {...props} />;
    default:
      return null;
  }
};

interface InputProps {
  setDto: (dto: CreateQuestionDto) => void;
  dto: CreateQuestionDto;
  handlers: HandlerObject<CreateQuestionDto>;
  errors: ErrorObject<CreateQuestionDto>;
  categories: string[];
  number?: number;
}
const MultipleChoiceInput = (inputProps: InputProps) => {
  return (
    <>
      <CorrectAnswerInput {...inputProps} number={0}></CorrectAnswerInput>
      <IncorrectAnswerInput {...inputProps} number={1}></IncorrectAnswerInput>
      <IncorrectAnswerInput {...inputProps} number={2}></IncorrectAnswerInput>
      <IncorrectAnswerInput {...inputProps} number={3}></IncorrectAnswerInput>
    </>
  );
};
const CorrectAnswerInput = ({ dto, handlers, errors }: InputProps) => {
  return (
    <TextField
      label="Correct answer"
      value={dto.correctAnswers[0]}
      onChange={(e) => handlers.correctAnswers([e.target.value])}
      error={!!errors.correctAnswers}
      helperText={errors.correctAnswers}
    ></TextField>
  );
};
const IncorrectAnswerInput = ({
  setDto,
  dto,
  handlers,
  errors,
  number = 0,
}: InputProps) => {
  return (
    <TextField
      sx={{ m: 3 }}
      label={`Incorrect answer no. ${number}`}
      value={dto.incorrectAnswers[number - 1]}
      onChange={(e) => {
        //console.log(dto.correctAnswers);
        const newIncorrectAnswers = dto.incorrectAnswers.slice();
        newIncorrectAnswers[number - 1] = e.target.value;
        handlers.incorrectAnswers(newIncorrectAnswers);
      }}
    ></TextField>
  );
};
const BooleanInput = ({ setDto, dto }: InputProps) => {
  return (
    <RadioGroup
      row
      aria-label="selection true/false"
      name="selection-true-false"
      value={dto.correctAnswers[0]}
      onChange={(event) => {
        if (event.target.value === 'True') {
          setDto({
            ...dto,
            correctAnswers: ['True'],
            incorrectAnswers: ['False'],
          });
        } else {
          setDto({
            ...dto,
            correctAnswers: ['False'],
            incorrectAnswers: ['True'],
          });
        }
      }}
    >
      {CheckBox('True')}
      {CheckBox('False')}
    </RadioGroup>
  );
};
const QuestionInput = ({ dto, handlers, errors }: InputProps) => {
  return (
    <TextField
      id="question-textfield"
      label="The Question"
      variant="outlined"
      multiline
      value={dto.question}
      onChange={(event) => handlers.question(event.target.value)}
      error={!!errors.question}
      helperText={errors.question}
    />
  );
};
const CategoryInput = ({ dto, handlers, errors, categories }: InputProps) => {
  return (
    <Autocomplete
      id="category-select"
      options={categories}
      getOptionLabel={(option) => option}
      value={dto.category}
      onChange={(_, newValue) => handlers.category(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Category"
          variant="outlined"
          error={!!errors.category}
          helperText={errors.category}
        />
      )}
    />
  );
};
const CheckBox = (value: string) => {
  return (
    <FormControlLabel
      key={'CheckBox-' + value}
      value={value}
      control={<Radio />}
      label={capitalizeAllWords(value)}
      labelPlacement="top"
    />
  );
};
const DifficultyInput = ({ dto, handlers }: InputProps) => {
  return (
    <RadioGroup
      row
      aria-label="selection difficulty"
      name="select-difficulty"
      value={dto.difficulty}
      onChange={(event) => handlers.difficulty(event.target.value)}
    >
      {AQuestionDifficulty.map((option) => CheckBox(option))}
    </RadioGroup>
  );
};
const TagsInput = ({ dto, handlers }: InputProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFocus(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setFocus(false);
    setAnchorEl(null);
    setError('');
    setValue('');
  };

  const handleAdd = () => {
    const errs = tagsValidator.validate([...dto.tags, value]).error;
    setError(errs ? errs.message : '');

    if (!errs) {
      handleClose();
      handlers.tags([...dto.tags, capitalizeAllWords(value.toLowerCase())]);
    }
  };
  return (
    <Stack direction="row" spacing={2}>
      {dto.tags.map((tag) => {
        return Tag(tag, handlers.tags, dto.tags, classes);
      })}
      {dto.tags.length < 10 ? (
        <Chip deleteIcon={<Add />} onDelete={handleClick} />
      ) : null}
      <Menu
        id="add-tag-menu"
        aria-controls="tag-select"
        aria-haspopup="true"
        className={classes.helperText}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{
          list: classes.noPadding,
        }}
      >
        <MenuItem disableRipple disableGutters className={classes.noPadding}>
          <TextField
            InputLabelProps={{ className: classes.popoverLabel }}
            inputRef={(input) => focus && input && input.focus()}
            label="Tag"
            variant="outlined"
            error={!!error}
            helperText={error}
            onChange={(e) => setValue(e.target.value)}
          />
          <IconButton onClick={handleAdd}>
            <Add />
          </IconButton>
        </MenuItem>
      </Menu>
    </Stack>
  );
};
const Tag = (
  name: string,
  handler: Handler,
  dto: string[],
  classes: ClassNameMap
) => {
  return (
    <Chip
      className={classes.chip}
      key={'chip-' + name}
      label={name}
      onDelete={() => handler(dto.filter((e) => e !== name))}
    ></Chip>
  );
};

const capitalizeAllWords = (string: string) =>
  string.replace(/\b\w/g, (l) => l.toUpperCase());

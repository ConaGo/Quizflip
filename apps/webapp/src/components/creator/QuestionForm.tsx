import {
  tagsValidator,
  createQuestionFormData,
  CreateQuestionDto,
  AQuestionDifficulty,
  QuestionType,
  AQuestionType,
} from '@libs/shared-types';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  CREATE_QUESTION,
  useForm,
  Handler,
  ErrorObject,
  HandlerObject,
} from '@libs/data-access';
import {
  Typography,
  Button,
  TextField,
  MenuItem,
  makeStyles,
  createStyles,
  Theme,
  Chip,
  Paper,
  Grid,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  Menu,
  ListItemIcon,
  IconButton,
  Tabs,
  Tab,
  TextareaAutosize,
  InputLabel,
} from '@material-ui/core';
import { PlusOne } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import { Autocomplete } from '@material-ui/lab';
import { ClassNameMap, mergeClasses } from '@material-ui/styles';

interface QuestionFormProps {
  categories: string[];
  type: QuestionType;
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export const QuestionForm = ({ categories }: QuestionFormProps) => {
  const classes = useStyles();
  const [type, setType] = useState<QuestionType>('multiple');
  const handleTypeChange = (
    event: React.ChangeEvent,
    newValue: QuestionType
  ) => {
    const newType = AQuestionType[newValue];
    setType(newType);
    if (newType === 'multiple') {
      console.log('first');
      setDto({ ...dto, incorrectAnswers: ['', '', ''], correctAnswer: '' });
    } else if (newType === 'boolean') {
      console.log('second');
      if (dto.correctAnswer !== 'True' && dto.correctAnswer !== 'False') {
        handlers.correctAnswer('True');
      }
      if (dto.correctAnswer === 'True' && dto.incorrectAnswers[0] !== 'False')
        handlers.incorrectAnswers(['False']);
      else if (
        dto.correctAnswer === 'False' &&
        dto.incorrectAnswers[0] !== 'True'
      )
        handlers.incorrectAnswers(['True']);
    }
  };
  const defaultValues: CreateQuestionDto = {
    type: 'boolean',
    category: categories.length > 0 ? categories[0] : '',
    tags: [],
    difficulty: 'medium',
    question: '',
    correctAnswer: '',
    incorrectAnswers: ['', '', ''],
    language: 'english',
    authorId: 2,
  };
  const { setDto, dto, handlers, onSubmit, errors, loading, error } = useForm(
    defaultValues,
    createQuestionFormData,
    CREATE_QUESTION
  );
  const inputProps: InputProps = {
    setDto,
    dto,
    handlers,
    errors,
    categories,
  };
  return (
    <Grid
      container
      justifyContent="center"
      className={classes.container}
      spacing={2}
    >
      <Paper elevation={10} className={classes.paper}>
        <Tabs
          value={AQuestionType.indexOf(type)}
          onChange={handleTypeChange}
          aria-label="question-type-tab-select"
        >
          <Tab label="True Or False" {...a11yProps(1)} />
          <Tab label="Multiple Choice" {...a11yProps(0)} />
        </Tabs>
        <Typography variant="h4">Create A New Question</Typography>
        <QuestionInput {...inputProps}></QuestionInput>
        {typeSwitch(type, inputProps)}
        <CategoryInput {...inputProps} />
        <DifficultyInput {...inputProps} />
        <TagsInput {...inputProps} />
        <Button onClick={onSubmit}>Submit Question</Button>
      </Paper>
    </Grid>
  );
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      //background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
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
const typeSwitch = (type: QuestionType, inputProps: InputProps) => {
  switch (type) {
    case 'multiple':
      return <MultipleChoiceInput {...inputProps} />;
    case 'boolean':
      return <BooleanInput {...inputProps} />;
    default:
      return null;
  }
};
interface InputProps {
  setDto: Dispatch<SetStateAction<CreateQuestionDto>>;
  dto: CreateQuestionDto;
  handlers: HandlerObject<CreateQuestionDto>;
  errors: ErrorObject<CreateQuestionDto>;
  categories?: string[];
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
      value={dto.correctAnswer}
      onChange={(e) => handlers.correctAnswer(e.target.value)}
      error={!!errors.correctAnswer}
      helperText={errors.correctAnswer}
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
      label={`Incorrect answer no. ${number}`}
      value={dto.incorrectAnswers[number]}
      onChange={(e) => {
        console.log(dto.correctAnswer);
        const newIncorrectAnswers = dto.incorrectAnswers.slice();
        newIncorrectAnswers[number] = e.target.value;
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
      value={dto.correctAnswer}
      onChange={(event) => {
        if (event.target.value === 'True') {
          setDto({
            ...dto,
            correctAnswer: 'True',
            incorrectAnswers: ['False'],
          });
        } else {
          setDto({
            ...dto,
            correctAnswer: 'False',
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
    <>
      {dto.tags.map((tag) => {
        return Tag(tag, handlers.tags, dto.tags, classes);
      })}
      {dto.tags.length < 10 ? (
        <Chip deleteIcon={<AddIcon />} onDelete={handleClick} />
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
            <AddIcon />
          </IconButton>
        </MenuItem>
      </Menu>
    </>
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

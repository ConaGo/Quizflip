import {
  tagsValidator,
  createQuestionFormData,
  CreateQuestionDto,
  AQuestionDifficulty,
} from '@libs/shared-types';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
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
} from '@material-ui/core';
import { PlusOne } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import { Autocomplete } from '@material-ui/lab';
import { ClassNameMap, mergeClasses } from '@material-ui/styles';

import Joi from 'joi';

type QuestionType = 'boolean' | 'multiple';
export const QuestionForm = ({ categories }) => {
  const classes = useStyles();
  const [type, setType] = useState<QuestionType>('multiple');
  return (
    <Grid
      container
      justifyContent="center"
      className={classes.container}
      spacing={2}
    >
      <Paper elevation={10} className={classes.paper}>
        <BooleanQuestionForm categories={categories}></BooleanQuestionForm>
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
    popoverLabel: {
      '&.Mui-focused': {
        position: 'absolute',
        top: '0.3rem',
      },
    },
    img: {
      maxHeight: 240,
      maxWidth: 520,
      alignSelf: 'center',
      overflow: 'hidden',
    },
    container: {
      display: 'flex',

      justifyContent: 'center',
      overflow: 'hidden',
    },
    header: {
      marginBottom: 0,
    },
    unstyledButton: {
      textTransform: 'none',
    },
    passwordForgot: {
      alignSelf: 'right',
    },
    input: {
      '& p': {
        position: 'absolute',
        bottom: '-2em',
      },
      marginBottom: '2em',
    },
  })
);
const BooleanQuestionForm = ({ categories }) => {
  const classes = useStyles();
  const defaultValues: CreateQuestionDto = {
    type: 'boolean',
    category: categories[0],
    tags: [],
    difficulty: 'medium',
    question: '',
    correctAnswer: '',
    incorrectAnswers: [],
    language: 'english',
    authorId: 1,
  };
  const { dto, handlers, onSubmit, errors, loading, error } = useForm(
    defaultValues,
    createQuestionFormData,
    CREATE_QUESTION
  );
  const values = dto;
  const inputProps: InputProps = {
    values,
    handlers,
    errors,
    categories,
  };
  return (
    //<div className={classes.container}>
    <>
      <Typography variant="h4">Create A New Question</Typography>
      <CategoryInput {...inputProps}></CategoryInput>
      <DifficultyInput {...inputProps}></DifficultyInput>
      <TagsInput {...inputProps} />
      <Button onClick={onSubmit}>Submit Question</Button>
    </>
    //</div>
  );
};

interface InputProps {
  values: CreateQuestionDto;
  handlers: HandlerObject<CreateQuestionDto>;
  errors: ErrorObject<CreateQuestionDto>;
  categories?: string[];
}
const CategoryInput = ({
  values,
  handlers,
  errors,
  categories,
}: InputProps) => {
  return (
    <Autocomplete
      id="Category-select"
      options={categories}
      getOptionLabel={(option) => option}
      value={values.category}
      onChange={(event, newValue) => handlers.category(newValue)}
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
      key={'CheckBox' + value}
      value={value}
      control={<Radio />}
      label={capitalizeAllWords(value)}
      labelPlacement="top"
    />
  );
};
const DifficultyInput = ({ values, handlers }: InputProps) => {
  return (
    <RadioGroup
      row
      aria-label="gender"
      name="gender1"
      value={values.difficulty}
      onChange={(event) => handlers.difficulty(event.target.value)}
    >
      {AQuestionDifficulty.map((option) => CheckBox(option))}
    </RadioGroup>
  );
};
const TagsInput = ({ values, handlers, errors }: InputProps) => {
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
    const errs = tagsValidator.validate([...values.tags, value]).error;
    setError(errs ? errs.message : '');

    if (!errs) {
      handleClose();
      handlers.tags([...values.tags, capitalizeAllWords(value.toLowerCase())]);
    }
  };
  return (
    <>
      {values.tags.map((tag) => {
        return Tag(tag, handlers.tags, values.tags, classes);
      })}
      {values.tags.length < 10 ? (
        <Chip deleteIcon={<AddIcon />} onDelete={handleClick} />
      ) : null}
      <Menu
        id="add-tag-menu"
        aria-controls="tag-select"
        aria-haspopup="true"
        //className={classes.menu}
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
  values: string[],
  classes: ClassNameMap
) => {
  return (
    <Chip
      className={classes.chip}
      key={'chip-' + name}
      label={name}
      onDelete={() => handler(values.filter((e) => e !== name))}
    ></Chip>
  );
};

const capitalizeAllWords = (string: string) =>
  string.replace(/\b\w/g, (l) => l.toUpperCase());

import { useQuery } from '@apollo/client';
import { GET_RANDOM_QUESTIONS } from '@libs/data-access';
import { CreateQuestionDto } from '@libs/shared-types';
import {
  LinearProgress,
  CircularProgress,
  FormControlLabel,
  Switch,
  Slide,
  Paper,
  Fade,
  Theme,
  makeStyles,
  createStyles,
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import { useState } from 'react';
import { useSpring, animated, useSprings, interpolate } from 'react-spring';
const unescape = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#039;/g, '’');

interface QuestionFieldProps {
  question: string;
}
const QuestionField = ({ question }: QuestionFieldProps) => {
  const classes = useStyles();
  const props = useSpring({
    config: { duration: 2000 },
    opacity: 1,
    from: { opacity: 0 },
  });
  return (
    <AnimatedPaper style={props} elevation={4} className={classes.paper}>
      <Typography variant="h5">{unescape(question)}</Typography>
    </AnimatedPaper>
  );
};
interface QuestionProps {
  question: CreateQuestionDto;
}
const Question = ({ question }: QuestionProps) => {
  const classes = useStyles();
  return (
    <Paper elevation={6}>
      <Typography variant="h4">{unescape(question.question)}</Typography>
      <Button>{question.correctAnswer}</Button>
      <Button>{question.incorrectAnswers[0]}</Button>
      <Button>{question.incorrectAnswers[1]}</Button>
      <Button>{question.incorrectAnswers[2]}</Button>
      <div className={classes.card}></div>
    </Paper>
  );
};

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
const from = (i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

const AnimatedPaper = animated(Paper);
interface QuestionCardProps {
  questions: any;
}
const QuestionCards = ({ questions }: QuestionCardProps) => {
  const classes = useStyles();
  const [gone] = useState(() => new Set());
  const [props, set] = useSprings(questions.length, (i) => ({
    ...to(i),
    from: from(i),
  }));
  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div
          className={classes.cardContainer}
          key={i}
          style={{
            transform: interpolate(
              [x, y],
              (x: number, y: number) => `translate3d(${x}px,${y}px,0)`
            ),
          }}
        >
          <AnimatedPaper
            className={classes.cardi}
            style={{ transform: interpolate([rot, scale], trans) }}
            elevation={6}
          >
            <Typography variant="h4">
              {unescape(questions[i].question)}
            </Typography>
            <Button>{questions[i].correctAnswers}</Button>
            <Button>{questions[i].incorrectAnswers}</Button>
            <Button>{questions[i].incorrectAnswers}</Button>
            <Button>{questions[i].incorrectAnswers}</Button>
            <Button>{questions[i].answers[1]}</Button>
            <Button>{questions[i].answers[2]}</Button>
            <Button>{questions[i].answers[3]}</Button>
            <Button>{questions[i].answers[4]}</Button>
            <div className={classes.card}></div>
          </AnimatedPaper>
        </animated.div>
      ))}
    </>
  );
};
export const SoloQuestionGame = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_RANDOM_QUESTIONS, {
    variables: { count: 10 },
  });
  /*   const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked((prevState) => !prevState);
  }; */
  const [questions, setQuestions] = useState<CreateQuestionDto[]>([]);
  const handleStartGame = () => {
    console.log(data);
    setQuestions(data.randomQuestions);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>{error.networkError?.message || 'error'}</p>;

  return (
    <Grid
      container
      justifyContent="center"
      className={classes.container}
      spacing={2}
    >
      <Grid item xs={7}>
        <p>SoloQuestionGame</p>
        <Paper>
          {/*           <FormControlLabel
            control={<Switch checked={checked} onChange={handleChange} />}
            label="Show"
          /> */}
          {questions[0] ? (
            <QuestionCards questions={questions}></QuestionCards>
          ) : (
            <Button onClick={handleStartGame}>Start Game</Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {},
    container: {},
    card: { height: '300px', width: '140px', backgroundColor: 'green' },
    cardi: {
      backgroundColor: 'white',
      backgroundSize: 'auto 85%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      width: '45vh',
      maxWidth: '300px',
      height: '85vh',
      maxHeight: '570px',
      willChange: 'transform',
      borderRadius: '10px',
      boxShadow:
        '0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3)',
    },
    cardContainer: {
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      willChange: 'transform',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

// implementation idea with just material ui
/* <>
<Fade
  in={checked}
  style={{ transitionDelay: checked ? '0ms' : '7000ms' }}
>
  <Paper elevation={4} className={classes.paper}>
    <Typography variant="h4">
      {currentQuestion.question}
    </Typography>
  </Paper>
</Fade>

<Slide
  direction={checked ? 'right' : 'left'}
  in={checked}
  style={{ transitionDelay: checked ? '0ms' : '700ms' }}
>
  <Paper elevation={4} className={classes.paper}>
    <Button>{currentQuestion.correctAnswer}</Button>
  </Paper>
</Slide>
<Slide
  direction={checked ? 'right' : 'left'}
  in={checked}
  style={{ transitionDelay: checked ? '0ms' : '700ms' }}
>
  <Paper elevation={4} className={classes.paper}>
    <Button>{currentQuestion.incorrectAnswers[0]}</Button>
  </Paper>
</Slide>
<Slide
  direction={checked ? 'right' : 'left'}
  style={{ transitionDelay: checked ? '400ms' : '200ms' }}
  in={checked}
>
  <Paper elevation={4} className={classes.paper}>
    <Button>{currentQuestion.incorrectAnswers[1]}</Button>
  </Paper>
</Slide>
<Slide
  direction={checked ? 'right' : 'left'}
  style={{ transitionDelay: checked ? '600ms' : '0ms' }}
  in={checked}
>
  <Paper elevation={4} className={classes.paper}>
    <Button>{currentQuestion.incorrectAnswers[2]}</Button>
  </Paper>
</Slide> */

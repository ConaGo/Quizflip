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
import { useSpring, animated } from 'react-spring';

export const SoloQuestionGame = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_RANDOM_QUESTIONS, {
    variables: { count: 10 },
  });
  const [checked, setChecked] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<CreateQuestionDto>(
    new CreateQuestionDto()
  );
  const questionProps = useSpring({
    loop: true,
    config: { duration: 2000 },
    opacity: 1,
    from: { opacity: 0 },
  });
  //const useSlide()
  const handleChange = () => {
    setChecked((prevState) => !prevState);
  };
  const handleStartGame = () => {
    console.log(data);
    setCurrentQuestion(data.randomQuestions[0]);
  };
  const AnimatedPaper = animated(Paper);
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
          <FormControlLabel
            control={<Switch checked={checked} onChange={handleChange} />}
            label="Show"
          />
          {currentQuestion.correctAnswer ? (
            <>
              <AnimatedPaper
                style={questionProps}
                elevation={4}
                className={classes.paper}
              >
                <Typography variant="h5">{currentQuestion.question}</Typography>
              </AnimatedPaper>

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
              </Slide>
            </>
          ) : (
            <Button onClick={handleStartGame}>Start Game</Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({ paper: {}, container: {} })
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

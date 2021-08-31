const fs = require('fs');
const formatQuestion = (category, tags, id, type, mediapath, q) => {
  const ret = {
    type: 'multiple',
    category: category,
    tags: tags,
    difficulty: 'medium',
    question: q.text,
    correctAnswers: q.correctAnswers,
    incorrectAnswers: q.incorrectAnswers,
    language: 'german',
    authorId: id,
    mediapath: mediapath,
    driverQuestionType: type,
  };
  return ret;
};

//const absolutePath = './app/question/entities/driverQuestion.data/metadata.json'
(async () => {
  const data = JSON.parse(
    fs.readFileSync('./driverQuestion.data/metadata.json').toString()
  );
  let category = '';
  let tags = [];
  data.forEach((metadata) => {
    //regex with negative look ahead
    //matches only 1.2 and not 1.2.1
    //This gives us the main categories
    if (metadata.link.match(/\d.\d(?!.)/)) {
      category = metadata.text;
    } else {
      if (metadata.number === '2.2.19') return;
      //this is a subcategory with actual questions and a file
      const questions = JSON.parse(
        fs
          .readFileSync('./driverQuestion.data/' + metadata.number + '.json')
          .toString()
      );
      tags = [questions.text];
      questions.questions.forEach((question) => {
        let mediapath = '';
        let type = 'simple';
        const video = question.medialink.match(/\d_\d_\d\d_\d\d\d(_\w)*.mp4/);
        const image = question.medialink.match(/\d_\d_\d\d_\d\d\d(_\w)*.mp4/);
        if (video) {
          mediapath = video[0];
          type = 'video';
        }
        if (image) {
          mediapath = image[0];
          type = 'image';
        }
        const q = formatQuestion(category, tags, 2, type, mediapath, question);
      });
    }
  });
})();

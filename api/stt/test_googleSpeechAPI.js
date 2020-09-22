// Deprecated
// 10MB 제한 에러? stackoverflow
// https://stackoverflow.com/questions/51601697/invalid-argument-request-payload-size-exceeds-the-limit-10485760-bytes

// 긴 오디오 파일 스크립트 작성
// 로컬 파일을 사용하여 긴 오디오 파일 텍스트 변환
// https://cloud.google.com/speech-to-text/docs/async-recognize#speech_transcribe_async-nodejs

const WAV_FILE_PATH = '/Users/minho/My_Workspace/test_google_speech_api/LSTM_lecture.wav'

async function asyncRecognizeLocal() {
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');
  const fs = require('fs');

  // Creates a client
  const client = new speech.SpeechClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const filename = WAV_FILE_PATH;
  const encoding = 'LINEAR16';
  const sampleRateHertz = 48000;
  const languageCode = 'ko-KR';

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    enableAutomaticPunctuation: true
  };
  const audio = {
    content: fs.readFileSync(filename).toString('base64'),
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);

  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);
}

asyncRecognizeLocal()

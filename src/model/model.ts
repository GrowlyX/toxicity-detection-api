import * as DICTIONARY from './dictionary';
import {loadLayersModel, tensor2d, LayersModel, Tensor, io} from '@tensorflow/tfjs-node';

const modelPath = '/home/test/toxicity-detection-api/model/model.json';
const handler = io.fileSystem(modelPath);

const ENCODING_LENGTH = 21; // The number of input elements the ML Model is expecting, 21 because we have 20 words plus the START token.

let model: LayersModel | undefined = undefined;

/**
 * Load the model and predict the toxicity level of the input text.
 * @param inputText - The input text to analyze.
 * @returns The toxicity level as a percentage.
 */
export async function loadAndPredict(inputText: string): Promise<number> {
  if (model === undefined) {
    model = await loadLayersModel(handler);
  }

  // Convert sentence to lower case, strip all characters that are not alphanumeric or spaces,
  // and then split on spaces to create a word array.
  let lowercaseSentenceArray: string[] = inputText.toLowerCase().replace(/[^\w\s]/g, ' ').split(' ').slice(0, 20);

  // Call model.predict and pass to it an input in the form of a Tensor and then store the result.
  const results: Tensor = model.predict(tokenize(lowercaseSentenceArray)) as Tensor;

  // Extract the values from the Tensor and store them in a JavaScript array.
  const dataArray: Float32Array = await results.data<'float32'>();

  // dataArray[1] contains the probability of the text being toxic, which can be converted to a percentage.
  const toxicityLevel: number = dataArray[1] * 100;
  console.log('Toxicity level: ' + toxicityLevel);

  return toxicityLevel;
}

/**
 * Function that takes an array of words, converts words to tokens, and then returns a Tensor representation
 * of the tokenization that can be used as input to the machine learning model.
 * @param wordArray - The array of words to tokenize.
 * @returns A 2D tensor representing the tokenized input.
 */
function tokenize(wordArray: string[]): Tensor {
  const returnArray: number[] = [DICTIONARY.START];

  // Loop through the words in the sentence to encode.
  for (const word of wordArray) {
    const encoding: number | undefined = DICTIONARY.LOOKUP[word];
    returnArray.push(encoding === undefined ? DICTIONARY.UNKNOWN : encoding);
  }

  // Fill the rest with PAD tokens if the number of words is less than the minimum encoding length.
  while (returnArray.length < ENCODING_LENGTH) {
    returnArray.push(DICTIONARY.PAD);
  }

  // Convert to a TensorFlow Tensor 2D and return it.
  return tensor2d([returnArray]);
}

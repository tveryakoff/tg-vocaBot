import mongoose from 'mongoose'
import { wordSchema } from '../word'
import { Dictionary } from '../../../../types/user'
import { transformWord } from '../../../../utils /dictionary'
const { Schema } = mongoose

export const DICTIONARY_MODEL_NAME = 'Dictionary'

export const dictionarySchema = new Schema<Dictionary>(
  {
    name: { type: String, default: 'English words dictionary' },
    targetLanguage: { type: String, default: 'English' },
    translationLanguage: { type: String, default: 'Russian' },
    words: [
      {
        type: wordSchema,
        default: [],
      },
    ],
  },
  {
    methods: {
      getWordForTraining: async function () {
        const totalSum = this.words
          .sort((a, b) => a.mark - b.mark)
          .reduce((sum, element) => sum + getProbability(element.mark), 0)
        const randomValue = Math.random() * totalSum

        let cumulativeProbability = 0
        for (let i = 0; i < this.words.length; i++) {
          cumulativeProbability += getProbability(this.words[i].mark)

          if (randomValue <= cumulativeProbability) {
            return this.words[i]
          }
        }
      },
      checkWord: async function (checkWordInput) {
        const { word, userInput, type } = checkWordInput
        const userInputTransformed = transformWord(userInput)
        const targetWordIndex = this.words.findIndex((w) => w.value === word)
        if (targetWordIndex === -1) {
          throw new Error(`Word "${word}" not found while checking word`)
        }

        const targetWord = this.words[targetWordIndex]

        const correctAnswer = type === 'word' ? targetWord.value : targetWord.translation
        const isCorrect = correctAnswer === userInputTransformed

        if (isCorrect) {
          this.words[targetWordIndex] = {
            //@ts-ignore
            ...targetWord._doc,
            //@ts-ignore
            mark: targetWord.mark < 3 ? targetWord.mark + 1 : 3,
          }
        } else {
          this.words[targetWordIndex] = {
            //@ts-ignore
            ...targetWord._doc,
            //@ts-ignore
            mark: targetWord.mark > 1 ? targetWord.mark - 1 : 1,
          }
        }

        await this.save()

        return {
          correctAnswer,
          isCorrect,
        }
      },
    },
  },
)

function getProbability(mark: number) {
  switch (mark) {
    case 1:
      return 60
    case 2:
      return 30
    case 3:
      return 10
    default:
      return 0
  }
}

const DictionaryModel = mongoose.model(DICTIONARY_MODEL_NAME, dictionarySchema)

export default DictionaryModel

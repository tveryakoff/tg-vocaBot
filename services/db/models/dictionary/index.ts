import mongoose from 'mongoose'
import { wordSchema } from '../word'
import { Dictionary, DictionaryMethods, WordMongooseHydrated } from '../../../../types/user'
import { transformWord } from '../../../../utils /dictionary'
const { Schema } = mongoose

export const DICTIONARY_MODEL_NAME = 'Dictionary'

export const dictionarySchema = new Schema<Dictionary & DictionaryMethods>(
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
      hasWord: function (valueRaw, translationRaw) {
        const value = valueRaw?.trim()?.toLowerCase()
        const translation = translationRaw?.trim()?.toLowerCase()

        for (const word of this.words) {
          if (word.value === value) {
            return `Word "${value}" already exists in your dictionary`
          }
          if (word.translation === translation) {
            return `Word "${translation}" already exists in your dictionary`
          }
        }
      },
      addWord: async function ({ value: valueRaw, translation: translationRaw, transcription, mark }) {
        const value = valueRaw.trim().toLowerCase()
        const translation = translationRaw.trim().toLowerCase()

        const hasWordMessage = this.hasWord(value, translation)

        if (hasWordMessage) {
          return {
            justAdded: null,
            message: hasWordMessage,
          }
        }
        this.words.push({
          value,
          translation,
          transcription,
          mark,
        })
        await this.save()
        return {
          justAdded: {
            value,
            translation,
          },
        }
      },
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
      editWord: async function (editWordInput) {
        const wordIndex = this.words.findIndex(
          (w: WordMongooseHydrated) => w._id.toString() === editWordInput._id.toString(),
        )
        if (wordIndex === -1) {
          throw new Error(`Word ${editWordInput.value} not found`)
        }

        this.words[wordIndex] = {
          ...(this.words as WordMongooseHydrated[])[wordIndex]._doc,
          value: transformWord(editWordInput.value) || this.words[wordIndex].value,
          translation: transformWord(editWordInput.translation) || this.words[wordIndex].translation,
        }

        await this.save()
        return this.words[wordIndex]
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

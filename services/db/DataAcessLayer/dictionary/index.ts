import DictionaryModel from '../../models/dictionary'
import { DictionaryDto, Word, WordDto } from '../../types'
import { HydratedDocument } from 'mongoose'
import { transformWord } from '../../../../utils/dictionary'

export type GetWordsInputDto = {
  page: number
}

export type CheckWordInputDto = {
  word: string
  userInput: string
  type: 'word' | 'translation'
}

export type CheckWordResponseDto = { isCorrect: boolean; correctAnswer: string }

type Params = {
  dictData?: DictionaryDto
  model?: HydratedDocument<DictionaryDto>
}

export class Dictionary {
  private readonly dictionary: HydratedDocument<DictionaryDto> = null

  constructor(params: Params) {
    if (params.model) {
      this.dictionary = params.model
    } else {
      this.dictionary = new DictionaryModel(params.dictData)
    }
  }

  get _id() {
    return this.dictionary._id
  }

  get name() {
    return this.dictionary.name
  }

  get targetLanguage() {
    return this.dictionary.targetLanguage
  }

  get translationLanguage() {
    return this.dictionary.translationLanguage
  }

  get words() {
    return this.dictionary.words
  }

  private getProbability(mark: number) {
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

  static mapMongooseWordToDto(word: Word): WordDto {
    return {
      _id: word._id,
      value: word.value,
      translation: word.translation,
      context: word.context,
      transcription: word.transcription,
      lastTrained: word.lastTrained,
      createdAt: word.createdAt,
      mark: word.mark,
    }
  }

  static mapWordListToDto(words: Word[]): WordDto[] {
    return words.map((w) => Dictionary.mapMongooseWordToDto(w))
  }

  static async getDictionary(dictId) {
    if (!dictId) {
      return null
    }
    return DictionaryModel.findById(dictId)
  }

  static async updateDictionary(dictInput: Partial<DictionaryDto>) {
    const { _id, ...rest } = dictInput
    await DictionaryModel.findByIdAndUpdate(_id, rest)
  }

  static async deleteDictionary(dictId) {
    await DictionaryModel.findByIdAndDelete(dictId)
  }

  async save() {
    await this.dictionary.save()
  }

  public async getWords(input: GetWordsInputDto) {
    const { page } = input
    const perPage = 5
    if (!this.dictionary.words.length) {
      return { words: [], total: 0 }
    }
    const end =
      (page + 1) * perPage <= this.dictionary.words.length ? (page + 1) * perPage : this.dictionary.words.length
    return {
      words: Dictionary.mapWordListToDto(this.dictionary.words.slice(page * perPage, end)),
      total: Math.ceil(this.dictionary.words.length / perPage) || 0,
    }
  }

  public async hasWord(valueRaw: string, translationRaw?: string) {
    const value = valueRaw?.trim()?.toLowerCase()
    const translation = translationRaw?.trim()?.toLowerCase()

    for (const word of this.dictionary.words) {
      if (word.value === value) {
        return `Word "${value}" already exists in your dictionary`
      }
      if (word.translation === translation) {
        return `Word "${translation}" already exists in your dictionary`
      }
    }
  }

  public async addWord({ value: valueRaw, translation: translationRaw, context, transcription, mark }: Word) {
    const value = valueRaw.trim().toLowerCase()
    const translation = translationRaw.trim().toLowerCase()

    const hasWordMessage = await this.hasWord(value, translation)

    if (hasWordMessage) {
      return {
        justAdded: null,
        message: hasWordMessage,
      }
    }
    this.dictionary.words.push({
      value,
      translation,
      context,
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
  }

  public getWordForTraining() {
    const totalSum = this.dictionary.words
      .sort((a, b) => a.mark - b.mark)
      .reduce((sum, element) => sum + this.getProbability(element.mark), 0)
    const randomValue = Math.random() * totalSum

    let cumulativeProbability = 0
    for (let i = 0; i < this.dictionary.words.length; i++) {
      cumulativeProbability += this.getProbability(this.dictionary.words[i].mark)

      if (randomValue <= cumulativeProbability) {
        return Dictionary.mapMongooseWordToDto(this.dictionary.words[i])
      }
    }
  }

  public async checkWord(checkWordInput: CheckWordInputDto): Promise<CheckWordResponseDto> {
    const { word, userInput, type } = checkWordInput
    const userInputTransformed = transformWord(userInput)
    const targetWordIndex = this.dictionary.words.findIndex((w) => w.value === word)
    if (targetWordIndex === -1) {
      throw new Error(`Word "${word}" not found while checking word`)
    }

    const targetWord = this.dictionary.words[targetWordIndex]

    const correctAnswer = type === 'word' ? targetWord.value : targetWord.translation
    const isCorrect = correctAnswer === userInputTransformed

    if (isCorrect) {
      this.dictionary.words[targetWordIndex] = {
        ...targetWord._doc,
        mark: (targetWord.mark < 3 ? targetWord.mark + 1 : 3) as Word['mark'],
      }
    } else {
      this.dictionary.words[targetWordIndex] = {
        ...targetWord._doc,
        mark: (targetWord.mark > 1 ? targetWord.mark - 1 : 1) as Word['mark'],
      }
    }

    await this.dictionary.save()

    return {
      correctAnswer,
      isCorrect,
    }
  }

  public async editWord(editWordInput): Promise<WordDto> {
    const wordIndex = this.dictionary.words.findIndex((w) => w._id.toString() === editWordInput._id.toString())
    if (wordIndex === -1) {
      throw new Error(`Word ${editWordInput.value} not found`)
    }

    this.dictionary.words[wordIndex] = {
      ...this.dictionary.words[wordIndex]._doc,
      value: transformWord(editWordInput.value) || this.dictionary.words[wordIndex].value,
      translation: transformWord(editWordInput.translation) || this.dictionary.words[wordIndex].translation,
    }

    await this.dictionary.save()
    return Dictionary.mapMongooseWordToDto(this.dictionary.words[wordIndex])
  }

  public async deleteWord(wordId: string) {
    this.dictionary.words = this.dictionary.words.filter((w) => w._id.toString() !== wordId)
    await this.dictionary.save()
    return this
  }
}

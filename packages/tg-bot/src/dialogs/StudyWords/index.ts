import { Dialog } from '../index'
import { MyContext } from '../../context'
import { INITIAL_DIALOG_STATE } from '../constants'
import { DIALOG_STATE, TRAIN_WORDS_STAGE } from '../types'
import studyTypeMenu from '../../menus/StudyTypeMenu'

export class StudyWords extends Dialog<'studyWords'> {
  constructor(ctx: MyContext) {
    super(ctx)
    this.name = 'studyWords'
    this.initialState = { ...INITIAL_DIALOG_STATE.studyWords }
  }

  async start(initialState?: DIALOG_STATE['studyWords']): Promise<any> {
    await super.start(initialState)
    const { words } = this.ctx.activeDictionary

    if (!this.contextState.stage || this.contextState.stage === TRAIN_WORDS_STAGE.DEFAULT) {
      if (!words?.length) {
        await this.ctx.reply(`Your dictionary is empty! Try adding some vocab instead`)
        return this.ctx.enterDialog('addWords')
      }

      this.contextState = { stage: TRAIN_WORDS_STAGE.GET_WORD }

      return await this.ctx.reply(`Please choose the way you want to learn new words:`, {
        reply_markup: studyTypeMenu,
      })
    }

    if (this.contextState.stage === TRAIN_WORDS_STAGE.GET_WORD) {
      const word = await this.ctx.activeDictionary.getWordForTraining()

      this.contextState = {
        type: this.contextState.type,
        stage: TRAIN_WORDS_STAGE.CHECK_WORD,
        word: word.value,
      }

      const opposite = this.contextState.type === 'word' ? word.translation : word.value
      return await this.ctx.reply(`Type in the translation for "${opposite}":`)
    }
  }

  async handleTextInput(): Promise<any> {
    const { stage, word, type } = this.contextState

    if (stage === TRAIN_WORDS_STAGE.CHECK_WORD) {
      const userInput = this.ctx?.message?.text

      const { isCorrect, correctAnswer } = await this.ctx.activeDictionary.checkWord({
        word,
        userInput,
        type,
      })

      if (isCorrect) {
        await this.ctx.reply(`Correct!`)
        return this.enterDialog(this.name, {
          type,
          stage: TRAIN_WORDS_STAGE.GET_WORD,
          word: null,
        })
      } else {
        await this.ctx.reply(`Nope, the correct answer would be "${correctAnswer}"`)
        return this.enterDialog(this.name, {
          type,
          stage: TRAIN_WORDS_STAGE.GET_WORD,
          word: null,
        })
      }
    }
  }
}

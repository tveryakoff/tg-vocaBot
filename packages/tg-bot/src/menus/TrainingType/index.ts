import { Menu } from '@grammyjs/menu'
import { MyContextType } from '../../context'
import { AppState } from '../../context/session'
import { TRAIN_WORDS_STAGE } from '../../dialogs/constants'

const trainingTypeMenu = new Menu<MyContextType>('trainingType')
  .text('Translation - Word', async (ctx) => {
    ctx.session[AppState.TRAIN_WORDS].type = 'word'
    ctx.session[AppState.TRAIN_WORDS].stage = TRAIN_WORDS_STAGE.GET_WORD
    return ctx.dialog.enter(AppState.TRAIN_WORDS, { ...ctx.session[AppState.TRAIN_WORDS] })
  })
  .text(`Word - Translation`, async (ctx) => {
    ctx.session[AppState.TRAIN_WORDS].type = 'translation'
    ctx.session[AppState.TRAIN_WORDS].stage = TRAIN_WORDS_STAGE.GET_WORD
    return ctx.dialog.enter(AppState.TRAIN_WORDS, { ...ctx.session[AppState.TRAIN_WORDS] })
  })

export default trainingTypeMenu

import { Menu } from '@grammyjs/menu'
import { MyContextType } from '../../types/context'
import { AppState } from '../../types/dialogs'

const trainingTypeMenu = new Menu<MyContextType>('trainingType')
  .text('Translation - Word', async (ctx) => {
    ctx.session[AppState.TRAIN_WORDS].type = 'word'
    return ctx.dialog.enter(AppState.TRAIN_WORDS, { ...ctx.session[AppState.TRAIN_WORDS] })
  })
  .text(`Word - Translation`, async (ctx) => {
    ctx.session[AppState.TRAIN_WORDS].type = 'translation'
    return ctx.dialog.enter(AppState.TRAIN_WORDS, { ...ctx.session[AppState.TRAIN_WORDS] })
  })

export default trainingTypeMenu

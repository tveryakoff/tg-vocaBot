import { Menu } from '@grammyjs/menu'

import { TRAIN_WORDS_STAGE } from '../../dialogs/types'
import { MyContext } from '../../context'

const studyTypeMenu = new Menu<MyContext>('studyType')
  .text(
    'Translation - Word',
    async (ctx) =>
      await ctx.enterDialog('studyWords', {
        type: 'word',
        stage: TRAIN_WORDS_STAGE.GET_WORD,
      }),
  )
  .text(
    `Word - Translation`,
    async (ctx) =>
      await ctx.enterDialog('studyWords', {
        type: 'translation',
        stage: TRAIN_WORDS_STAGE.GET_WORD,
      }),
  )

export default studyTypeMenu

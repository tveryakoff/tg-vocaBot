import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'
import { ADD_WORDS_STAGE } from '../../dialogs/types'

const skipContextMenu = new Menu<MyContext>('skipContextMenu')

skipContextMenu.text('Skip', (ctx) => {
  const contextData = ctx.getDialogContext('addWords')
  return ctx.enterDialog('addWords', { ...contextData, stage: ADD_WORDS_STAGE.CONTEXT, skipped: true, context: null })
})

export default skipContextMenu

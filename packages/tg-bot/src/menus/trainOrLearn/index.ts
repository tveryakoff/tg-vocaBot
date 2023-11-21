import { Menu } from '@grammyjs/menu'
import { CONVERSATION } from '../../constants/conversation'
import { MyContextType } from '../../types/context'

const addOrLearnMenu = new Menu<MyContextType>('addOrLearn')
  .text('Add some vocab', async (ctx) => {
    return await ctx.conversation.enter(CONVERSATION.ADD_WORD)
  })
  .text(`Train the words you've added`, (ctx) => ctx.reply('Train my words!'))

export { addOrLearnMenu }

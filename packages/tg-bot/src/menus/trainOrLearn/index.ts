import { Menu } from '@grammyjs/menu'
import { MyContextType } from '../../types/context'

const addOrLearnMenu = new Menu<MyContextType>('addOrLearn')
  .text('Add some vocab', async (ctx) => {
    return await ctx.dialog.enter('addWordEnter')
  })
  .text(`Train the words you've added`, (ctx) => ctx.dialog.enter('trainWords'))

export { addOrLearnMenu }

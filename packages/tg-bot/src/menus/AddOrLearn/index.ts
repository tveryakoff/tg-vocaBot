import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'

const addOrLearnMenu = new Menu<MyContext>('addOrLearn')
  .text('Add some vocab', async (ctx) => {
    return ctx.enterDialog('addWords')
  })
  .text(`Train the words you've added`, (ctx) => ctx.enterDialog('studyWords'))

export { addOrLearnMenu }

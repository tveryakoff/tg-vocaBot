import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'

const addOrLearnMenu = new Menu<MyContext>('addOrLearn')
  .text('Add some vocab', async (ctx) => {
    return ctx.enterDialog('addWords')
  })
  .row()
  .text(`Study words`, (ctx) => ctx.enterDialog('studyWords'))

export { addOrLearnMenu }

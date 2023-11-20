import { Menu } from '@grammyjs/menu'

const addOrLearnMenu = new Menu('addOrLearn')
  .text('Add some vocab', (ctx) => ctx.reply('Add some vocab!'))
  .text(`Train the words you've added`, (ctx) => ctx.reply('Train my words!'))

export { addOrLearnMenu }

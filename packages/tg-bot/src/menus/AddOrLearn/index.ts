import { Menu } from '@grammyjs/menu'
import {  MyContextType } from '../../context'
import { AppState } from '../../context/session'

const addOrLearnMenu = new Menu<MyContextType>('addOrLearn')
  .text('Add some vocab', async (ctx) => {
    return await ctx.dialog.enter(AppState.ADD_WORDS)
  })
  .text(`Train the words you've added`, (ctx) => ctx.dialog.enter(AppState.TRAIN_WORDS))

export { addOrLearnMenu }

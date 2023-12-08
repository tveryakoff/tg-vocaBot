import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'
import { goToChooseWord, goToEditWordTranslation, goToEditWordValue, deleteWord } from './handlers'
import { BotError } from 'grammy'

const editWordMenuType = new Menu<MyContext>('editWordMenu')
editWordMenuType.dynamic(async (ctx, range) => {
  const data = ctx.getDialogContext('editWords')
  if (!data) {
    return
  }
  const { page, stage } = data
  const { words, total } = await ctx.activeDictionary.getWords({ page })
  for (const word of words) {
    range
      .text(`${word.value} - ${word.translation}`, async (ctx) => {
        ctx.setDialogContext('editWords', { word, page, stage })
        return ctx.menu.nav('editSelect')
      })
      .text('❌', async (ctx) => {
        await deleteWord(ctx, word)
      })
    range.row()
  }

  if (total > 1) {
    const { page, ...rest } = ctx.getDialogContext('editWords')
    if (page > 0) {
      range.text('<', async (ctx) => {
        ctx.setDialogContext('editWords', { ...rest, page: page - 1 })
        return ctx.menu.update()
      })
    }
    if (page + 1 < total) {
      range.text('>', async (ctx) => {
        ctx.setDialogContext('editWords', { ...rest, page: page + 1 })
        return ctx.menu.update()
      })
    }
  }
})

const editSelect = new Menu<MyContext>('editSelect')

editSelect.dynamic(async (ctx, range) => {
  const { word } = ctx.getDialogContext('editWords')

  range
    .text(`${word.value}`, goToEditWordValue)
    .text(`${word.translation}`, goToEditWordTranslation)
    .row()
    .text('Go back', goToChooseWord)
})

editWordMenuType.register(editSelect)

export default editWordMenuType

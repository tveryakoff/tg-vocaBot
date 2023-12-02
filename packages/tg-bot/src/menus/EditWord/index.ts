import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'
import { goToChooseWord, goToEditWordTranslation, goToEditWordValue, deleteWord } from './handlers'

const editWordMenuType = new Menu<MyContext>('editWordMenu')
editWordMenuType.dynamic(async (ctx, range) => {
  const { page, stage } = ctx.getDialogContext('editWords')
  const { words, total } = await ctx.user.getDictWords({ page, dictId: ctx.session.activeDictionaryId })
  for (const word of words) {
    range
      .text(`${word.value} - ${word.translation}`, async (ctx) => {
        ctx.setDialogContext('editWords', { word, page, stage })
        return ctx.menu.nav('editSelect')
      })
      .text('❌', async (ctx) => {
        await deleteWord(ctx, word)
        ctx.activeDictionary.words = ctx.activeDictionary.words.filter((w) => w.value !== word.value)
        return await ctx.enterDialog('editWords')
      })
    range.row()
  }

  if (total > 1) {
    const { page, ...rest } = ctx.getDialogContext('editWords')
    range.text('<', async (ctx) => {
      if (page > 0) {
        return await ctx.enterDialog('editWords', { ...rest, page: page - 1 })
      }
      return await ctx.reply(`It's already the first page!`)
    })
    range.text('>', async (ctx) => {
      if (page + 1 < total) {
        return await ctx.enterDialog('editWords', { ...rest, page: page + 1 })
      }
      return await ctx.reply(`It's already the last page!`)
    })
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

import { Menu } from '@grammyjs/menu'
import { MyContextType } from '../../context'
import { AppState } from '../../context/session'
import { deleteWord } from '../../dialogs/editWords/deleteWord'

const editWordMenuType = new Menu<MyContextType>('editWordMenu')
editWordMenuType.dynamic(async (ctx, range) => {
  const { page } = ctx.session[AppState.EDIT_WORDS]
  const { words, total } = await ctx.user.getDictWords({ page, dictId: ctx.session.activeDictionaryId })
  for (const word of words) {
    range
      .text(`${word.value} - ${word.translation}`, (ctx) => {
        console.log(word.value)
      })
      .text('❌', async (ctx, next) => {
        await deleteWord(ctx, word)
        return await next()
      })
    range.row()
  }

  range.text('<', async (ctx, next) => {
    if (page > 0) {
      ctx.session[AppState.EDIT_WORDS].page--
      return await next()
    }
    return await ctx.reply(`It's already the first page!`)
  })
  range.text('>', async (ctx, next) => {
    if (page + 1 < total) {
      ctx.session[AppState.EDIT_WORDS].page++
      return await next()
    }
    return await ctx.reply(`It's already the last page!`)
  })
})
export default editWordMenuType

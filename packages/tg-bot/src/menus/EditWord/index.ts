import { Menu } from '@grammyjs/menu'
import { MyContextType } from '../../context'
import { AppState } from '../../context/session'
import { deleteWord } from '../../dialogs/editWords/deleteWord'
import { goToChooseWord, goToEditWordTranslation, goToEditWordValue } from '../../dialogs/editWords/goToEditWordValue'

const editWordMenuType = new Menu<MyContextType>('editWordMenu')
editWordMenuType.dynamic(async (ctx, range) => {
  const { page } = ctx.session[AppState.EDIT_WORDS]
  const { words, total } = await ctx.user.getDictWords({ page, dictId: ctx.session.activeDictionaryId })
  for (const word of words) {
    range
      .text(`${word.value} - ${word.translation}`, async (ctx) => {
        ctx.session[AppState.EDIT_WORDS].word = word
        return ctx.menu.nav('editSelect')
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

const editSelect = new Menu<MyContextType>('editSelect')

editSelect.dynamic(async (ctx, range) => {
  range
    .text(`${ctx.session[AppState.EDIT_WORDS].word.value}`, goToEditWordValue)
    .text(`${ctx.session[AppState.EDIT_WORDS].word.translation}`, goToEditWordTranslation)
    .row()
    .text('Go back', goToChooseWord)
})

editWordMenuType.register(editSelect)

export default editWordMenuType

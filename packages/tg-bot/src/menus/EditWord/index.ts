import { Menu } from '@grammyjs/menu'
import { MyContextType } from '../../context'
import { AppState } from '../../context/session'

const editWordMenuType = new Menu<MyContextType>('editWordMenu')
editWordMenuType.dynamic(async (ctx, range) => {
  const { page } = ctx.session[AppState.EDIT_WORDS]
  const words = await ctx.user.getDictWords({ page, dictId: ctx.session.activeDictionaryId })
  for (const word of words) {
    range
      .text(`${word.value} - ${word.translation}`, (ctx) => {
        console.log(word.value)
      })
      .text('❌', (ctx) => `delete ${word.value}`)
    range.row()
  }

  range.text('<')
  range.text('>')
})
export default editWordMenuType

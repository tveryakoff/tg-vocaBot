import { MyContextType } from '../../context'
import { Word } from '../../../../../types/user'
import { AppState } from '../../context/session'
import { INITIAL_DIALOG_STATE } from '../constants'

export const deleteWord = async (ctx: MyContextType, word: Word) => {
  await ctx.user.deleteWord(ctx.session.activeDictionaryId, word.value)
  ctx.session[AppState.EDIT_WORDS] = { ...INITIAL_DIALOG_STATE[AppState.EDIT_WORDS] }
  return await ctx.reply(`Word pair "${word.value}" - "${word.translation}" has been deleted!`)
}

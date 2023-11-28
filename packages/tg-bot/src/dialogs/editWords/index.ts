import { MyContextType } from '../../context'
import { AppState } from '../../context/session'
import { MiddlewareFn } from 'grammy'
import { EDIT_WORDS_STAGE } from '../types'
import editWordMenuType from '../../menus/EditWord'

const editWords: MiddlewareFn<MyContextType> = async (ctx, next) => {
  if (ctx.session.state !== AppState.EDIT_WORDS) {
    return await next()
  }

  const { stage, page } = ctx.session[AppState.EDIT_WORDS]

  if (!stage || stage === EDIT_WORDS_STAGE.DEFAULT) {
    return await ctx.reply(`Choose the word you want to edit:`, { reply_markup: editWordMenuType })
  }
}

export default editWords

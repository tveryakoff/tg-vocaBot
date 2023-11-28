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
    const words = await ctx.user.getDictWords({ dictId: ctx.session.activeDictionaryId, page })
    if (!words?.length) {
      ctx.session.state = AppState.DEFAULT
      return await ctx.reply(`You haven't added any words yet, so nothing to update! Try adding some vocab instead`)
    }

    return await ctx.reply(`Choose the word you want to edit:`, { reply_markup: editWordMenuType })
  }
}

export default editWords

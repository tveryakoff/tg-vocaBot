import { MyContextType } from '../../context'
import { AppState } from '../../context/session'
import { MiddlewareFn } from 'grammy'
import { EDIT_WORDS_STAGE } from '../types'
import editWordMenuType from '../../menus/EditWord'
import { INITIAL_DIALOG_STATE } from '../constants'

const editWords: MiddlewareFn<MyContextType> = async (ctx, next) => {
  if (ctx.session.state !== AppState.EDIT_WORDS) {
    return await next()
  }

  const { stage, page } = ctx.session[AppState.EDIT_WORDS]

  if (!stage || stage === EDIT_WORDS_STAGE.DEFAULT) {
    const { words } = await ctx.user.getDictWords({ dictId: ctx.session.activeDictionaryId, page })
    if (!words?.length) {
      ctx.session[AppState.EDIT_WORDS] = { ...INITIAL_DIALOG_STATE[AppState.EDIT_WORDS] }
      await ctx.reply(`Your dictionary is empty! Try adding some vocab instead`)
      return ctx.dialog.enter(AppState.ADD_WORDS)
    }

    return await ctx.reply(`Choose the word you want to edit:`, { reply_markup: editWordMenuType })
  }

  if (stage === EDIT_WORDS_STAGE.WORD_EDIT_START) {
    ctx.session[AppState.EDIT_WORDS].stage = EDIT_WORDS_STAGE.WORD_EDIT_END
    return await ctx.reply(`Type in a replacement for "${ctx.session[AppState.EDIT_WORDS]?.word?.value}"`)
  }

  if (stage === EDIT_WORDS_STAGE.WORD_EDIT_END) {
    const wordValueInput = ctx.message.text
    if (!wordValueInput) {
      await ctx.reply(`A word can't be empty`)
      return ctx.dialog.enter(AppState.EDIT_WORDS, {
        ...ctx.session[AppState.EDIT_WORDS],
        stage: EDIT_WORDS_STAGE.WORD_EDIT_START,
      })
    }

    return
  }

  if (stage === EDIT_WORDS_STAGE.TRANSLATION_EDIT_START) {
    ctx.session[AppState.EDIT_WORDS].stage = EDIT_WORDS_STAGE.TRANSLATION_EDIT_END
    return await ctx.reply(`Type in a replacement for "${ctx.session[AppState.EDIT_WORDS]?.word?.translation}"`)
  }

  if (stage === EDIT_WORDS_STAGE.TRANSLATION_EDIT_END) {
    const wordTranslationInput = ctx.message.text
    if (!wordTranslationInput) {
      await ctx.reply(`A translation can't be empty`)
      return ctx.dialog.enter(AppState.EDIT_WORDS, {
        ...ctx.session[AppState.EDIT_WORDS],
        stage: EDIT_WORDS_STAGE.TRANSLATION_EDIT_START,
      })
    }

    console.log(wordTranslationInput)
    return
  }
}

export default editWords

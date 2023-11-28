import { MiddlewareFn } from 'grammy'
import { MyContextType } from '../../context'
import { AppState } from '../../context/session'
import { EDIT_WORDS_STAGE } from '../types'

export const goToEditWordValue: MiddlewareFn<MyContextType> = async (ctx) => {
  return ctx.dialog.enter(AppState.EDIT_WORDS, {
    word: ctx.session[AppState.EDIT_WORDS].word,
    stage: EDIT_WORDS_STAGE.WORD_EDIT_START,
  })
}

export const goToEditWordTranslation: MiddlewareFn<MyContextType> = async (ctx) => {
  return ctx.dialog.enter(AppState.EDIT_WORDS, {
    word: ctx.session[AppState.EDIT_WORDS].word,
    stage: EDIT_WORDS_STAGE.TRANSLATION_EDIT_START,
  })
}

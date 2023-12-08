import { WordMongooseHydrated } from '../../../../../types/user'
import { MyContext } from '../../context'
import { MiddlewareFn } from 'grammy'
import { EDIT_WORDS_STAGE } from '../../dialogs/types'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'

export const deleteWord = async (ctx: MyContext & { menu: MenuControlPanel }, word: WordMongooseHydrated) => {
  try {
    const wordId = word._id.toString()
    const contextData = ctx.getDialogContext('editWords')

    if (contextData.deletingWordId) {
      return
    }

    const deleteWordPromise = ctx.activeDictionary.deleteWord(wordId)
    ctx.setDialogContext('editWords', { ...contextData, deletingWordId: wordId })
    await deleteWordPromise
    ctx.setDialogContext('editWords', { ...contextData, deletingWordId: undefined })
    ctx.activeDictionary.words = ctx.activeDictionary.words.filter((w) => w.value !== word.value)
    await ctx.menu.update()
  } catch (e) {
    console.log('e')
  }
}

export const goToEditWordValue: MiddlewareFn<MyContext> = async (ctx) => {
  const { page, word } = ctx.getDialogContext('editWords')

  return ctx.enterDialog('editWords', {
    page: page || 0,
    word: word,
    stage: EDIT_WORDS_STAGE.WORD_EDIT_START,
  })
}

export const goToEditWordTranslation: MiddlewareFn<MyContext> = async (ctx) => {
  const { page, word } = ctx.getDialogContext('editWords')

  return ctx.enterDialog('editWords', {
    page: page || 0,
    word: word,
    stage: EDIT_WORDS_STAGE.TRANSLATION_EDIT_START,
  })
}

export const goToChooseWord: MiddlewareFn<MyContext> = async (ctx) => {
  const { page } = ctx.getDialogContext('editWords')

  return ctx.enterDialog('editWords', {
    word: null,
    page: page || 0,
    stage: EDIT_WORDS_STAGE.DEFAULT,
  })
}

import { Word } from '../../../../../types/user'
import { MyContext } from '../../context'
import { MiddlewareFn } from 'grammy'
import { EDIT_WORDS_STAGE } from '../../dialogs/types'

export const deleteWord = async (ctx: MyContext, word: Word) => {
  await ctx.user.deleteWord(ctx.session.activeDictionaryId, word.value)
  return await ctx.reply(`Word pair "${word.value}" - "${word.translation}" has been deleted!`)
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

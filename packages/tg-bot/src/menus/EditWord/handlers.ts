import { WordMongooseHydrated } from '../../../../../types/user'
import { MyContext } from '../../context'
import { EDIT_WORDS_STAGE } from '../../dialogs/types'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'

export const deleteWord = async (ctx: MyContext & { menu: MenuControlPanel }, word: WordMongooseHydrated) => {
  try {
    const wordId = word._id.toString()
    await ctx.activeDictionary.deleteWord(wordId)

    const contextData = ctx.getDialogContext('editWords')
    ctx.activeDictionary.words = ctx.activeDictionary.words.filter((w) => w.value !== word.value)

    const { total } = await ctx.activeDictionary.getWords({ page: contextData.page })

    if (total === 0) {
      await ctx.reply(`Your dictionary's empty, add some vocab`)
      return ctx.enterDialog('addWords')
    }

    if (total <= contextData.page) {
      ctx.setDialogContext('editWords', { ...contextData, page: contextData.page - 1 })
    }

    await ctx.menu.update()
  } catch (e) {
    console.log('e')
  }
}

export const goToEditWordValue = async (ctx: MyContext, word: WordMongooseHydrated, page = 0) => {
  return ctx.enterDialog('editWords', {
    page: page || 0,
    word: word,
    stage: EDIT_WORDS_STAGE.WORD_EDIT_START,
  })
}

export const goToEditWordTranslation = async (ctx: MyContext, word: WordMongooseHydrated, page = 0) => {
  return ctx.enterDialog('editWords', {
    page: page || 0,
    word: word,
    stage: EDIT_WORDS_STAGE.TRANSLATION_EDIT_START,
  })
}

export const goBack = async (ctx: MyContext) => {
  const { page } = ctx.getDialogContext('editWords')

  return ctx.enterDialog('editWords', {
    word: null,
    page: page || 0,
    stage: EDIT_WORDS_STAGE.DEFAULT,
  })
}

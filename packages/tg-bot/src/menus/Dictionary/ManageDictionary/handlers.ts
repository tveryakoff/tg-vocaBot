import { MyContext } from '../../../context'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'
import { WordMongooseHydrated } from '../../../../../../types/user'
import Dictionary from '../../../../../../services/db/models/dictionary'

export const deleteWord = async (ctx: MyContext & { menu: MenuControlPanel }, word: WordMongooseHydrated) => {
  const wordId = word._id.toString()
  const { page, ...data } = ctx.getDialogContext('manageDictionary')
  const dictionary = await Dictionary.findById(data.editDictId)
  if (!dictionary) {
    return
  }
  await dictionary.deleteWord(wordId)

  const { total } = await dictionary.getWords({ page })


  if (total === 0) {
    await ctx.reply(`Your dictionary's empty`)
    return ctx.enterDialog('manageDictionary')
  }

  if (total <= page) {
    ctx.setDialogContext('manageDictionary', { ...data, page: page - 1 })
  }

  return await ctx.menu.update({ immediate: true })
}

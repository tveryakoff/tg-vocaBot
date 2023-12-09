import { MyContext } from '../../../context'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'
import { WordMongooseHydrated } from '../../../../../../types/user'
import Dictionary from '../../../../../../services/db/models/dictionary'

export const deleteWord = async (ctx: MyContext & { menu: MenuControlPanel }, word: WordMongooseHydrated) => {
  const wordId = word._id.toString()
  const { editDictId } = ctx.getDialogContext('manageDictionary')
  const dictionary = await Dictionary.findById(editDictId)
  if (!dictionary) {
    return
  }
  await dictionary.deleteWord(wordId)
  await ctx.menu.update()
}

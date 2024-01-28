import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../../context'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'
import Dictionary from '../../../../../../services/db/models/dictionary'

type MenuButtonHandlersContext = MyContext & { menu: MenuControlPanel }

export type Options = {
  id: string
  onChangeName: (ctx: MyContext) => unknown
  onEditWords: (ctx: MenuButtonHandlersContext) => unknown
  onDictionaryDelete: (ctx: MenuButtonHandlersContext) => unknown
}

export default class ManageDictionaryMenu extends Menu<MyContext> {
  constructor({ id, onChangeName, onEditWords, onDictionaryDelete }: Options) {
    super(id)

    this.dynamic(async (ctx, range) => {
      const hasMany = ctx.user.dictionaries.length > 1
      const contextData = ctx.getDialogContext('manageDictionary')
      const dictionary = await Dictionary.findById(contextData.editDictId)
      const hasWords = dictionary?.words?.length
      range.text('Change name', (ctx) => onChangeName(ctx)).row()
      if (hasWords) {
        range
          .text('Edit words', async (ctx) => {
            onEditWords(ctx)
          })
          .row()
      }

      if (hasMany) {
        range.text('Delete', (ctx) => onDictionaryDelete(ctx)).row()
        range.back('Go back')
      }

      return range
    })
  }
}

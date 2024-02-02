import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'
import { WordDto } from '../../../../../services/db/types'
import DbAccessLayer  from '../../../../../services/db/DataAcessLayer'

type Options = {
  id: string
  getData: (ctx: MyContext) => { page?: number; word?: WordDto }
  setData: (ctx: MyContext, data: any) => void
  getDictId: (ctx: MyContext) => string
  onDeleteWord: (ctx: MyContext, word: WordDto) => Promise<any>
  onWordSelect: (ctx: MyContext & { menu: MenuControlPanel }, word: WordDto) => any
}

export default class EditWordMenu extends Menu<MyContext> {
  constructor({ id, getData, setData, onDeleteWord, onWordSelect, getDictId }: Options) {
    super(id)

    this.dynamic(async (ctx, range) => {
      const data = getData(ctx)
      if (!data) {
        return
      }
      const { page = 0 } = data
      const dictId = getDictId(ctx)
      const dictionary = await DbAccessLayer.getDictionary(dictId)
      if (!dictionary) {
        return
      }
      const { words, total } = await dictionary.getWords({ page })
      for (const word of words) {
        range
          .text({ text: `${word.value} - ${word.translation}` }, async (ctx) => {
            return await onWordSelect(ctx, word)
          })
          .text('❌', async (ctx) => {
            await onDeleteWord(ctx, word)
          })
        range.row()
      }

      if (total > 1) {
        if (page > 0) {
          range.text('<', async (ctx) => {
            const { page, ...rest } = getData(ctx)
            setData(ctx, { ...rest, page: page - 1 })
            ctx.menu.update()
          })
        }
        if (page + 1 < total) {
          range.text('>', async (ctx) => {
            const { page, ...rest } = getData(ctx)
            setData(ctx, { ...rest, page: page + 1 })
            ctx.menu.update()
          })
        }
      }
    })
  }
}

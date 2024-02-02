import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'
import { MenuControlPanel } from '@grammyjs/menu/out/menu'
import { WordDto } from '../../../../../services/db/types'

type Data = {
  word?: WordDto
}

export type Options = {
  id: string
  getData: (ctx: MyContext) => Data
  gotToEditWordValue: (ctx: MyContext, word?: WordDto) => unknown
  gotToEditWordTranslation: (ctx: MyContext, word?: WordDto) => unknown
  goBack: (ctx: MyContext & { menu: MenuControlPanel }) => unknown
}

export default class SelectWordOrTranslationSubMenu extends Menu<MyContext> {
  constructor({ id, getData, gotToEditWordValue, gotToEditWordTranslation, goBack }: Options) {
    super(id)

    this.dynamic(async (ctx, range) => {
      const { word } = getData(ctx)

      if (!word) {
        return
      }

      range
        .text(`${word.value}`, (ctx) => gotToEditWordValue(ctx, word))
        .text(`${word.translation}`, (ctx) => gotToEditWordTranslation(ctx, word))
        .row()
        .text('Go back', goBack)
    })
  }
}

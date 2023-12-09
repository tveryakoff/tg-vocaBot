import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'
import { goToEditWordTranslation, goToEditWordValue } from './handlers'
import { WordMongooseHydrated } from '../../../../../types/user'

type Data = {
  word?: WordMongooseHydrated
}

export type Options = {
  id: string
  getData: (ctx: MyContext) => Data
  gotToEditWordValue: (ctx: MyContext, word?: WordMongooseHydrated) => unknown
  gotToEditWordTranslation: (ctx: MyContext, word?: WordMongooseHydrated) => unknown
  goBack: (ctx: MyContext) => unknown
}

export default class SelectWordOrTranslationSubMenu extends Menu<MyContext> {
  constructor({ id, getData, gotToEditWordValue, gotToEditWordTranslation, goBack }: Options) {
    super(id)

    this.dynamic(async (ctx, range) => {
      const { word } = getData(ctx)

      range
        .text(`${word.value}`, (ctx) => gotToEditWordValue(ctx, word))
        .text(`${word.translation}`, (ctx) => gotToEditWordTranslation(ctx, word))
        .row()
        .text('Go back', goBack)
    })
  }
}

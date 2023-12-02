import { Dialog } from '../index'
import { dictionaryResolver } from '../../../../../services/db/resolvers/dictionary'
import { addOrLearnMenu } from '../../menus/AddOrLearn'
import { DictionaryMongooseHydrated } from '../../../../../types/user'
import { MyContext } from '../../context'

export class StartDialog extends Dialog {
  constructor(ctx: MyContext) {
    super(ctx)
    this.ctx = ctx
    this.name = 'start'
    this.initialState = null
  }

  async handleStart() {
    const dictionaries = this.ctx.user.dictionaries as DictionaryMongooseHydrated[]

    if (!dictionaries?.length) {
      const dict = await dictionaryResolver.createDictionary(this.ctx.user, {
        name: 'Default dictionary',
        words: [],
      })
      await this.ctx.reply(
        `Welcome ${this.ctx?.from?.username}! \nI've just created your first dictionary, go ahead and add some vocab in it!`,
      )
      this.ctx.session.activeDictionaryId = dict.id.toString()
      return this.ctx.enterDialog('addWords')
    }
    if (dictionaries.length === 1) {
      this.ctx.session.activeDictionaryId = dictionaries[0]._id.toString()
      return await this.ctx.reply(`Welcome ${this.ctx?.from?.username}! \n\nWhat are you up today?`, {
        reply_markup: addOrLearnMenu,
      })
    }
    // } else if (dictionaries.length > 1) {
    //   dictSelectMenu.row().dynamic((ctx, range) => {
    //     for (const dict of dictionaries) {
    //       range.text(dict?.name, (ctx) => ctx.reply(dict?._id || '')).row()
    //     }
    //   })
    //
    //   return await ctx.reply('Choose a dictionary to work with!', {
    //     reply_markup: dictSelectMenu,
    //   })
    // }
  }
}

import { Dialog } from '../index'
import { addOrLearnMenu } from '../../menus/AddOrLearn'
import { DictionaryMongooseHydrated } from '../../../../../types/user'
import { MyContext } from '../../context'
import { DIALOG_STATE } from '../types'
import { selectActiveDictionaryMenu } from '../../menus/SelectActiveDictionary'

export class StartDialog extends Dialog {
  constructor(ctx: MyContext) {
    super(ctx)
    this.ctx = ctx
    this.name = 'start'
    this.initialState = null
  }

  async start(initialState?: DIALOG_STATE['start']) {
    await super.start(initialState)
    const dictionaries = this.ctx.user.dictionaries as DictionaryMongooseHydrated[]

    if (!dictionaries?.length) {
      const dict = await this.ctx.user.createDictionary({
        name: 'Default dictionary',
        words: [],
      })
      await this.ctx.reply(
        `Welcome ${this.ctx?.from?.username}! \nI've just created your first dictionary, go ahead and add some vocab in it!`,
      )
      this.ctx.session.activeDictionaryId = dict._id.toString()
      this.ctx.activeDictionary = dict
      return this.enterDialog('addWords')
    }
    if (dictionaries.length === 1) {
      this.ctx.session.activeDictionaryId = dictionaries[0]._id.toString()
      return await this.ctx.reply(`Welcome ${this.ctx?.from?.username}! \n\nWhat are you up today?`, {
        reply_markup: addOrLearnMenu,
      })
    } else if (dictionaries.length > 1) {
      return await this.ctx.reply('Choose a dictionary to work with!', {
        reply_markup: selectActiveDictionaryMenu,
      })
    }
  }
}

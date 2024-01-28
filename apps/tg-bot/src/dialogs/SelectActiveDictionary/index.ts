import { Dialog } from '../index'
import { DIALOG_STATE } from '../types'
import { selectActiveDictionaryMenu } from '../../menus/Dictionary/SelectActiveDictionary'

class SelectActiveDictionary extends Dialog<'selectActiveDictionary'> {
  constructor(initialState: DIALOG_STATE['selectActiveDictionary']) {
    super(initialState)
    this.name = 'selectActiveDictionary'
  }

  async start(initialState: DIALOG_STATE['selectActiveDictionary']) {
    await super.start(initialState)

    if (!this.ctx.user.dictionaries.length) {
      await this.ctx.reply(`You don't have any dictionaries yet, let's create one`)
      return this.ctx.enterDialog('addDictionary')
    }

    if (this.ctx.user.dictionaries.length === 1) {
      return await this.ctx.reply(`You have only one dictionary!`)
    }

    return this.ctx.reply('Select a dictionary to work with:', { reply_markup: selectActiveDictionaryMenu })
  }
}

export default SelectActiveDictionary

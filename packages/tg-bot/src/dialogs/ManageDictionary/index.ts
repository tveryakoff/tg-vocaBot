import { Dialog } from '../index'
import { MyContext } from '../../context'
import { DIALOG_STATE, MANAGE_DICTIONARY_STAGE } from '../types'
import { selectEditDictionaryMenu } from '../../menus/Dictionary/SelectEditDictionary'
import { editDictionaryMenu } from '../../menus/Dictionary/EditDictionary'

class ManageDictionary extends Dialog<'manageDictionary'> {
  constructor(ctx: MyContext) {
    super(ctx)
    this.initialState = null
    this.name = 'manageDictionary'
  }

  async start(initialState: DIALOG_STATE['manageDictionary']) {
    if (!this.ctx.user) {
      return await this.ctx.enterDialog('start')
    }

    if (!this.ctx.user.dictionaries.length) {
      await this.ctx.reply(`Seems like you don't have any dictionaries yer, let's create one`)
      return this.ctx.enterDialog('addDictionary')
    }

    await super.start(initialState)

    const { stage } = this.contextState

    const isInitial = !stage || stage === MANAGE_DICTIONARY_STAGE.DEFAULT
    const hasMany = this.ctx.user.dictionaries.length > 1

    if (isInitial && this.ctx.user.dictionaries.length === 1) {
      this.ctx.setEditDictionary(this.ctx.activeDictionary?._id)
      return await this.ctx.reply(`Manage dictionary`, { reply_markup: editDictionaryMenu })
    }

    if (isInitial && hasMany) {
      this.contextState.stage = MANAGE_DICTIONARY_STAGE.SELECT_DICT
      return await this.ctx.reply(`Select the dictionary you'd like to manage:`, {
        reply_markup: selectEditDictionaryMenu,
      })
    }

    if (stage === MANAGE_DICTIONARY_STAGE.SELECT_DICT) {
      return await this.ctx.reply(`Manage dictionary`, { reply_markup: editDictionaryMenu })
    }
  }
}

export default ManageDictionary

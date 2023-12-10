import { Dialog } from '../index'
import { MyContext } from '../../context'
import { ADD_DICTIONARY_STAGE, ADD_DICTIONARY_STATE } from '../types'
import { addOrLearnMenu } from '../../menus/AddOrLearn'

class AddDictionary extends Dialog<'addDictionary'> {
  constructor(ctx: MyContext) {
    super(ctx)
    this.name = 'addDictionary'
    this.initialState = {
      stage: ADD_DICTIONARY_STAGE.DEFAULT,
    }
  }

  async start(initialState?: ADD_DICTIONARY_STATE) {
    await super.start(initialState)

    if (!this.ctx?.user) {
      throw Error('No user')
    }

    if (this.ctx.user.dictionaries.length >= 5) {
      return await this.ctx.reply(`A user can't have more than 5 dictionaries, sorry!`)
      //TODO redirect to edit dictionaries
    }

    const { stage } = this.contextState

    if (stage === ADD_DICTIONARY_STAGE.DEFAULT || !stage) {
      this.contextState = {
        stage: ADD_DICTIONARY_STAGE.NAME,
      }

      return await this.ctx.reply(`Enter a name for your new dictionary:`)
    }
  }

  async handleTextInput(): Promise<any> {
    const { stage } = this.contextState
    const dictionaryName = this.ctx.message?.text

    if (stage === ADD_DICTIONARY_STAGE.NAME) {
      const dictionary = await this.ctx.user.createDictionary({ name: dictionaryName, words: [] })
      if (!dictionary) {
        throw new Error('Error while creating a new dictionary')
      }
      this.ctx.setActiveDictionary(dictionary._id.toString())

      await this.ctx.reply(`🎉 New dictionary "<b>${dictionaryName}</b>" has been created and set as an active one!`, {
        parse_mode: 'HTML',
        reply_markup: addOrLearnMenu,
      })
    }
  }
}

export default AddDictionary

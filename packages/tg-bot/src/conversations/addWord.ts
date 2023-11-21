import { MyConversation } from '../types/conversation'
import { MyContextType } from '../types/context'
import { userResolver } from '../../../../services/db/resolvers/user'
import { UserMongooseHydrated } from '../../../../types/user'
import { CONVERSATION } from '../constants/conversation'

export async function addWord(conversation: MyConversation, ctx: MyContextType) {
  console.log('conversation', ctx.session.activeDictionaryId)
  if (!ctx?.from?.id) {
    throw new Error('No user')
  }
  await ctx.reply('Type in a word')
  const {
    msg: { text: word },
  } = await conversation.waitFor('message:text')
  if (!word) {
    await ctx.reply(`A word can't empty!`)
  }
  await ctx.reply(`Type in a translation for ${word}`)

  const {
    msg: { text: translation },
  } = await conversation.waitFor('message:text')

  const user = (await userResolver.getByTgId(ctx.from.id)) as UserMongooseHydrated
  await user?.addWordToDictionary({ value: word, translation }, ctx?.session?.activeDictionaryId || '')
  //@ts-ignore
  return await ctx.reply(`A new pair ${word} - ${translation} has been added to ${user?.dictionaries[0].name}!`)
}

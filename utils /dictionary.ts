export const hasNoWords = (dictionaryList: Array<{ words: Array<any> }>) =>
  !dictionaryList?.length || dictionaryList.every((d) => !d?.words?.length)

export const transformWord = (word: string) => word.trim().toLowerCase()

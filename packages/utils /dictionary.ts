export const hasNoWords = (dictionaryList: Array<{ words: Array<any> }>) =>
  !dictionaryList?.length || dictionaryList.every((d) => !d?.words?.length)

import { DialogName } from '../dialogs/types'
import { AddWordsDialog } from '../dialogs/AddWords'
import { StartDialog } from '../dialogs/Start'
import { Dialog } from '../dialogs'
import { StudyWords } from '../dialogs/StudyWords'
import { EditWords } from '../dialogs/EditWordsClass'
import AddDictionary from '../dialogs/AddDictionary'
import SelectActiveDictionary from '../dialogs/SelectActiveDictionary'
import ManageDictionary from '../dialogs/ManageDictionary'

export const DIALOG_NAMES: DialogName[] = [
  'addWords',
  'start',
  'studyWords',
  'editWords',
  'addDictionary',
  'selectActiveDictionary',
  'manageDictionary',
]

export const DIALOG_CONSTRUCTOR = {
  addWords: AddWordsDialog,
  start: StartDialog,
  studyWords: StudyWords,
  editWords: EditWords,
  addDictionary: AddDictionary,
  selectActiveDictionary: SelectActiveDictionary,
  manageDictionary: ManageDictionary,
}

export const createDialogInstance = (dialogName: DialogName, params: any): Dialog | null => {
  const Constructor = DIALOG_CONSTRUCTOR[dialogName]

  if (!Constructor) {
    return null
  }

  return new Constructor(params)
}

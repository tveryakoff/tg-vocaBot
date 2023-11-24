export enum AppState {
  DEFAULT = 'default',
  ADD_WORDS = 'addWords',
  TRAIN_WORDS = 'trainWords',
}

export enum ADD_WORDS_STAGE {
  DEFAULT = 'default',
  WORD = 'word',
  TRANSLATION = 'translation',
}

export enum TRAIN_WORDS_STAGE {
  DEFAULT = 'default',
  SELECT_TRAINING_TYPE = 'selectTrainingType',
  CHECK_WORD = 'checkWord',
}

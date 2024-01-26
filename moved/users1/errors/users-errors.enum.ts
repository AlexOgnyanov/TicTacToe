export enum UsersErrors {
  EmailAlreadyTakenError = 'EMAIL_ALREADY_TAKEN_ERROR',
  UsernameAlreadyTakenError = 'USERNAME_ALREADY_TAKEN_ERROR',
  UserNotFound = 'USER_WITH_THIS_ID_NOT_FOUND',
  CreatorNotFoundError = 'CREATOR_NOT_FOUND_ERROR',
  AlreadyFollowingCreatorError = 'ALREADY_FOLLOWING_ERROR',
  NotFollowingCreatorError = 'NOT_FOLLOWING_ERROR',
  FollowTypeNotProvidedError = 'FOLLOW_TYPE_NOT_PROVIDED_ERROR',
  SocialTypeNotFoundError = 'SOCIAL_TYPE_NOT_FOUND',
  TagNotFoundError = 'TAG_NOT_FOUND',
  CannotFollowYourselfError = 'CANNOT_FOLLOW_YOURSELF',
  NotACreatorError = 'NOT_A_CREATOR_ERROR',
}

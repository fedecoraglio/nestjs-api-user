export enum ErrorCode {
  UserNotFound = 'user_not_found',
  UserProfileNotValid = 'user_profile_image_not_valid',
  UserErrorSaving = 'user_error_during_saving',
  UserErrorUpdating = 'user_error_during_updating',
  BadPaginationParameters = 'bad_pagination_parameters',
  BadFilterParameters = 'bad_filter_parameters',
  PasswordsNotMatch = 'passwords_not_match',
  AccessTokenNotValid = 'access_token_not_valid',
  AccessTokenExpired = 'access_token_expired',
}

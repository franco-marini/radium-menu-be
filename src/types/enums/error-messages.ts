/* eslint-disable no-unused-vars */
export enum SignUpErrors {
  invalidUsernamePassword = 'Invalid username or password',
  invalidUsername = 'Username already taken',
  invalidEmail = 'Email already taken',
}

export enum SignInErrors {
  noUserFound = 'No user found',
  emptyUser = 'User is empty',
  mobile = 'Mobile Users cannot login in web',
  webUsersInMobile = 'Only mobile users can login',
}

export enum AuthErrors {
  failed = 'Failed to authenticate',
  invalidRole = 'Your role does not have the necessary level to carry out this action',
}

export enum FbAuthErrors {
  getIdToken = 'There was an error getting the IdToken from firebase',
  firebase = 'There was an error from firebase',
}

export enum Validation {
  questionType = 'Invalid question type',
  changePasswordUser = 'User without email cannot change password',
}

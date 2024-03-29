// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  unauthorized: "You aren't logged in, Login to ediable your note.",
  clickToLogin: 'Click here to login.',
  authenticating: 'User authentication in progress, Please wait a moment...',
  note: {
    create: {
      placeholder: 'Enter your note.',
      label: 'Create note',
      message: {
        anonymous:
          'The note will be created under Guest. Do you want to continue?',
        default: 'Do you want to continue?',
        created: {
          success: 'Note created successfully.',
          error: 'Oops, the note could not be created. Please try again later.'
        }
      }
    },
    edit: {
      label: 'Edit note',
      done: 'Done'
    }
  }
};

//required because of google closure compiler
//overkill for this project, but seemingly painless
var keyMirror = require('keymirror');

module.exports = keyMirror({
  MACRO_UPDATE: null,
  MACRO_INCREMENT: null,
  UNDO_INCREMENT: null,
  REDO_INCREMENT: null
});

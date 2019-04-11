var fs = require('fs')

module.exports = {
  getColumns: fs.readFileSync(__dirname + '/columns.sql').toString(),
  getSequences: fs.readFileSync(__dirname + '/sequences.sql').toString(),
  getConstraints: fs.readFileSync(__dirname + '/constraints.sql').toString(),
  getTables: fs.readFileSync(__dirname + '/tables.sql').toString(),
  getViews: fs.readFileSync(__dirname + '/views.sql').toString(),
  getTypes: fs.readFileSync(__dirname + '/types.sql').toString(),
  getJoins: fs.readFileSync(__dirname + '/joins.sql').toString(),
}

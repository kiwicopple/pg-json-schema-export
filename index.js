'use strict'

var Promise = require('bluebird')
var _ = require('lodash')
var sql = require('./sql')

/**
 * Export a pg schema to json.
 *
 * @param connection
 * @returns {
 *  'schemaA': {
 *    'table1': {
 *      'column1: {
 *        'data_type': 'text',
 *        'is_nullable': true,
 *        ...
 *      }
 *    }
 *  }
 * }
 */
exports.toJSON = function(connection, schema, knexDestroyCb) {
  var knex = require('knex')({ client: 'pg', connection: connection })
  var queries = [
    knex.raw(sql.getTables, [schema]),
    knex.raw(sql.getViews, [schema]),
    knex.raw(sql.getSequences, [schema]),
    knex.raw(sql.getConstraints, [schema]),
    knex.raw(sql.getColumns, [schema]),
    knex.raw(sql.getTypes, [schema]),
    knex.raw(sql.getJoins, [schema]),
  ]

  return Promise.all(queries).spread(function(
    tables,
    views,
    sequences,
    constraints,
    columns,
    types,
    joins
  ) {
    
    // Enrich every column with FK information 
    let enrichedColumns = columns.rows.map(col => {
      let fk = joins.rows.find(join => col.column_name == join.column_name)
      if (!fk) return col
      else return {
        ...col,
        is_fk: true,
        foreign_table_schema: fk.foreign_table_schema,
        foreign_table_name: fk.foreign_table_name,
        foreign_column_name: fk.foreign_column_name,
        constraint_name: fk.constraint_name,
      }
    })
    var columnGroups = _.groupBy(enrichedColumns, 'table_name')
    var destroyCb = knexDestroyCb || function() {}
    knex.destroy(destroyCb)
    return {
      tables: _.transform(_.keyBy(tables.rows, 'table_name'), function(result, table, name) {
        result[name] = _.extend(table, {
          columns: _.keyBy(columnGroups[name], 'column_name'),
        })
      }),
      views: _.transform(_.keyBy(views.rows, 'table_name'), function(result, table, name) {
        result[name] = _.extend(table, {
          columns: _.keyBy(columnGroups[name], 'column_name'),
        })
      }),
      constraints: _.transform(_.groupBy(constraints.rows, 'table_name'), function(
        result,
        table,
        tableName
      ) {
        result[tableName] = _.groupBy(table, 'column_name')
      }),
      sequences: _.transform(_.groupBy(sequences.rows, 'table_name'), function(
        result,
        table,
        tableName
      ) {
        result[tableName] = _.keyBy(sequences.rows, 'column_name')
      }),
      types: _.keyBy(
        types.rows.map(x => ({ ...x, enums: x.enums.replace(/[{}/\"]/g, '').split(',') })),
        'name'
      ),
      columns: enrichedColumns,
      joins: joins.rows,
      counts: {
        sequences: sequences.rowCount,
        constraints: constraints.rowCount,
        tables: tables.rowCount,
        columns: columns.rowCount,
        views: views.rowCount,
        types: types.rowCount,
      },
    }
  })
}

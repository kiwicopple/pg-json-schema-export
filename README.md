# pg-json-schema-export

Export a Postgres schema as JSON. 
Fork of [https://github.com/tjwebb/pg-json-schema-export](https://github.com/tjwebb/pg-json-schema-export)

## Install

```sh
$ npm install --save git+https://git@github.com/kiwicopple/pg-json-schema-export.git
```

## Usage

```js
var PostgresSchema = require('pg-json-schema-export')
var connection = {
  user: 'postgres',
  password: '123',
  host: 'localhost',
  port: 5432,
  database: 'thedb',
}
PostgresSchema.toJSON(connection, 'public')
  .then(({ tables, views, constraints, sequences, counts }) => {
    // handle json object
    console.log('tables', tables)
    console.log('views', views)
    console.log('constraints', constraints)
    console.log('sequences', sequences)
    console.log('counts', counts)
  })
  .catch(function(error) {
    // handle error
  })
```

## Output Format

The output format is for the most part named after the columns in [`information_schema`](http://www.postgresql.org/docs/9.3/static/information-schema.html).

#### Structure

- schemas
  - views
    - columns
  - tables
    - columns
  - sequences

## API

#### `.toJSON(connection, schema)`

| parameter    | description                                                                                 |
| :----------- | :------------------------------------------------------------------------------------------ |
| `connection` | connection string or object compatible with [`pg`](https://github.com/brianc/node-postgres) |
| `schema`     | the database schema to export                                                               |

## License

MIT

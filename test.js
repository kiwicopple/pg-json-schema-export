var fs = require('fs');
var assert = require('assert');
var _ = require('lodash');
var exporter = require('./');

describe('pg-json-schema-export', function () {
  var options = {
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DATABASE || 'postgres',
    port: process.env.POSTGRES_PORT || 5432
  };

  describe('#toJSON', function () {
    this.timeout(process.env.TRAVIS ? 60 * 1000 : 20000);

    var schemas;
    before(function (done) {
      exporter.toJSON(options)
        .then(function (_schemas) {
          schemas = _schemas;
          done();
        })
        .catch(done);
    });

    it('should return an object', function () {
      assert(_.isObject(schemas));
      fs.writeFileSync('postbooks_demo_460.json', JSON.stringify(schemas, null, 2));
    });

    describe('can access specific objects with js dot-notation', function () {
      it('public.tables.cashrcpt.columns.cashrcpt_notes', function () {
        assert(_.isObject(schemas.public.tables));
        assert(_.isObject(schemas.public.tables.cashrcpt));
        assert(_.isObject(schemas.public.tables.cashrcpt.columns.cashrcpt_notes));
      });
      it('public.tables.atlasmap.columns.atlasmap_headerline.col_description', function () {
        assert(_.isString(schemas.public.tables.atlasmap.columns.atlasmap_headerline.col_description));
      });
      it('api.views.accountfile.columns.crmacct_id.data_type', function () {
        assert(_.isString(schemas.api.views.accountfile.columns.crmacct_id.data_type));
      });
      it('public.sequences.taxpay_taxpay_id_seq.cycle_option', function () {
        assert(_.isString(schemas.public.sequences.taxpay_taxpay_id_seq.cycle_option));
      });
      it('public.tables.acalitem.columns.acalitem_id.constraint_type', function () {
        assert(_.isString(schemas.public.tables.acalitem.columns.acalitem_id.constraint_type));
      });
    });

  });

});

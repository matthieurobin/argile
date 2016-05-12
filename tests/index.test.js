var argile = require('../lib/index');
var expect = require('expect.js');

describe('public properties', function () {

  it('argile should be defined', function () {
    expect(argile).not.to.be(undefined);
  });

  it('.convert() should be a function', function () {
    expect(argile.convert).not.to.be(undefined);
    expect(argile.convert).to.be.a('function');
  });

});

describe('convert one sql row', function () {

  describe('one level object', function () {

      it('sql columns = object properties', function () {
        var row = {id: 1, label: 'A'};
        var model = model = {
          id    : 'id',
          label : 'label'
        };
        var res = argile.convert(row, model); 
        expect(res).to.be.an('object');
        expect(res).to.eql(row);
      });

      it('sql columns != object properties', function () {
        var row = {idBook: 1, labelBook: 'A'};
        var model = model = {
          id    : 'idBook',
          label : 'labelBook'
        };
        var res = argile.convert(row, model); 
        expect(res).to.be.an('object');
        expect(res).to.eql({id: 1, label: 'A'});
      });

      it('mixed sql columns', function () {
        var row = {label: 'A', id: 1};
        var model = model = {
          id    : 'id',
          label : 'label'
        };
        var res = argile.convert(row, model); 
        expect(res).to.be.an('object');
        expect(res).to.eql({id: 1, label: 'A'});
      });

  });

});

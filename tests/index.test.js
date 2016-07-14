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


describe('one level object', function () {

  it('sql columns = object properties', function () {
    var rows  = [{id: 1, label: 'A'}, {id: 2, label: 'B'}];
    var model = model = {
      id    : 'id',
      label : 'label'
    };
    var res = argile.convert(rows, model); 
    expect(res).to.be.an('object');
    expect(res).to.eql(rows);
  });

  it('sql column names != object property names', function () {
    var row   = [{idBook: 1, labelBook: 'A'}, {idBook: 2, labelBook: 'B'}];
    var model = model = {
      id    : 'idBook',
      label : 'labelBook'
    };
    var res = argile.convert(row, model); 
    expect(res).to.be.an('object');
    expect(res).to.eql([{id: 1, label: 'A'}, {id: 2, label: 'B'}]);
  });

  it('mixed sql columns', function () {
    var row   = [{label: 'A', id: 1}, {label: 'B', id: 2}];
    var model = model = {
      id    : 'id',
      label : 'label'
    };
    var res = argile.convert(row, model); 
    expect(res).to.be.an('object');
    expect(res).to.eql([{id: 1, label: 'A'}, {id: 2, label: 'B'}]);
  });

});

describe('two levels object', function () {

  it('sql columns = object properties', function () {
    var rows  = [{id: 1, label: 'A', idAuthor: 2, name: 'Louis'}];
    var model = model = {
      id    : '*id',
      label : 'label',
      author : {
        id   : '*idAuthor',
        name : 'name'
      }
    };
    var res = argile.convert(rows, model); 
    expect(res).to.be.an('object');
    expect(res).to.eql([{id: 1, label: 'A', author: {id: 2, name: 'Louis'}}]);
  });

  it('null properties', function () {
    var rows  = [{id: 1, label: 'A', idAuthor: null, name: null}];
    var model = model = {
      id    : '*id',
      label : 'label',
      author : {
        id   : '*idAuthor',
        name : 'name'
      }
    };
    var res = argile.convert(rows, model); 
    expect(res).to.be.an('object');
    expect(res).to.eql([{id: 1, label: 'A', author: null}]);
  });

});

describe('sub arrays', function () {

  it('one sub array', function () {
    var rows  = [{id: 1, label: 'A', idAuthor: 2, name: 'Louis'}, {id: 1, label: 'A', idAuthor: 1, name: 'Marc'}];
    var model = model = {
      id    : '*id',
      label : 'label',
      authors : [{
        id   : '*idAuthor',
        name : 'name'
      }]
    };
    var res = argile.convert(rows, model); 
    expect(res).to.be.an('object');
    expect(res).to.eql([{id: 1, label: 'A', authors: [{id: 1, name: 'Marc'}, {id: 2, name: 'Louis'}]}]);
  });

  it('one sub array, multiple rows', function () {
    var rows  = [
      {id: 1, label: 'A', idAuthor: 2, name: 'Louis'}, {id: 1, label: 'A', idAuthor: 1, name: 'Marc'},
      {id: 3, label: 'B', idAuthor: 3, name: 'Tom'},
      {id: 5, label: 'C', idAuthor: 1, name: 'Marc'}, {id: 5, label: 'C', idAuthor: 2, name: 'Louis'},
    ];
    var model = model = {
      id    : '*id',
      label : 'label',
      authors : [{
        id   : '*idAuthor',
        name : 'name'
      }]
    };
    var res = argile.convert(rows, model); 
    expect(res).to.be.an('object');
    expect(res).to.eql([
      {id: 1, label: 'A', authors: [{id: 1, name: 'Marc'}, {id: 2, name: 'Louis'}]},
      {id: 3, label: 'B', authors: [{id: 3, name: 'Tom'}]},
      {id: 5, label: 'C', authors: [{id: 1, name: 'Marc'}, {id: 2, name: 'Louis'}]}
    ]);
  });

  it('one sub array with null results', function () {
    var rows  = [{id: 1, label: 'A', idAuthor: null, name: null}];
    var model = model = {
      id    : '*id',
      label : 'label',
      authors : [{
        id   : '*idAuthor',
        name : 'name'
      }]
    };
    var res = argile.convert(rows, model); 
    expect(res).to.be.an('object');
    expect(res).to.eql([{id: 1, label: 'A', authors: []}]);
  });

  /*it('sub array in sub array', function () {
    var rows  = [
      {id: 1, label: 'A', idAuthor: 2, name: 'Louis', idBook: 1, title: 'Book1'},
      {id: 1, label: 'A', idAuthor: 2, name: 'Louis', idBook: 2, title: 'Book2'},
      {id: 1, label: 'A', idAuthor: 1, name: 'Marc' , idBook: 3, title: 'Book3'},
    ];
    var model = model = {
      id    : '*id',
      label : 'label',
      authors : [{
        id   : '*idAuthor',
        name : 'name',
        books : [{
          id : '*idBook',
          title : 'title'
        }]
      }]
    };
    var res = argile.convert(rows, model); 
    expect(res).to.be.an('object');
    expect(res).to.eql([
      {id: 1, label: 'A', authors: [
        {id: 1, name: 'Marc', books: [
          {id: 3, title: 'Book3'}
        ]}, {id: 2, name: 'Louis', books: [
          {id:1, title: 'Book1'},
          {id:2, title: 'Book2'}
        ]}
      ]},
    ]);
  });*/

});

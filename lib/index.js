var argile = {};

function _searchId (model) {
  if (Array.isArray(model)) {
    model = model[0];
  }

  var keys = Object.keys(model);

  for (var i = 0; i < keys.length; i++) {
    if (/\*/.test(model[keys[i]])) {
      return model[keys[i]].slice(1);
    }
  }

  return keys.length ? model[keys[0]] : null;
}

function _computeRows (id, rows) {
  var computedRows = {};

  for (var i = 0; i < rows.length; i++) {
    if (!computedRows[rows[i][id]]) {
      computedRows[rows[i][id]] = [];
    }

    computedRows[rows[i][id]].push(rows[i]);
  }

  return computedRows;
} 

/**
 * Convert SQL rows to js object(s) according to a model
 * @param  {Array} rows, SQL rows
 * @param  {Object} model
 * @return {Array/Object}
 */
argile.convert = function convert (rows, model) {
  var id           = _searchId(model);
  //Todo return error if id === null
  var computedRows = _computeRows(id, rows);

  var keys             = Object.keys(model);
  var computedRowsKeys = Object.keys(computedRows);
  var res              = [];
  var obj              = {};
  var keyValue;
  var length;

  for (var j = 0; j < computedRowsKeys.length; j++) {
    for (var i = 0; i < keys.length; i++) {
      keyValue = model[keys[i]];

      if (/\*/.test(keyValue)) {
        keyValue = keyValue.slice(1);
      }

      if (typeof keyValue === 'object') {
        if (Array.isArray(keyValue)) {
          keyValue = keyValue[0];
          obj[keys[i]] = argile.convert(computedRows[computedRowsKeys[j]], keyValue);
        } else {
          obj[keys[i]] = argile.convert(computedRows[computedRowsKeys[j]], model[keys[i]])[0];
        }
      } else {
        obj[keys[i]] = computedRows[computedRowsKeys[j]][0][keyValue];
      } 
    }

    res.push(obj);
    obj = {};
  }

  return res;
};

module.exports = argile;

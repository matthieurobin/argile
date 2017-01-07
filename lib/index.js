var argile = {};

/**
 * Search the id in the model
 * @param  {Object/Array} model
 * @return {String}
 */
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

/**
 * For loop version of Array.indexOf
 * Better performance
 * @param  {Array} array
 * @param  {*} val
 * @return {int}
 */
function _indexOf (array, val) {
  var index = -1;
  for (var i = 0; i < array.length; i++) {
    if (array[i] === val) {
      return i;
    }
  }

  return index;
}

/**
 * Compute rows by id
 * @param  {String} id
 * @param  {Array} rows
 * @return {Array}
 */
function _computeRows (id, rows) {
  var computedRows        = {};
  var order               = [];
  var orderedComputedRows = [];

  for (var i = 0; i < rows.length; i++) {
    if (!computedRows[rows[i][id]]) {
      computedRows[rows[i][id]] = [];
    }

    computedRows[rows[i][id]].push(rows[i]);

    if (_indexOf(order, rows[i][id]) === -1) {
      order.push(rows[i][id]);
    }
  }

  for (var j = 0; j < order.length; j++) {
    orderedComputedRows.push(computedRows[order[j]]);
  }

  return orderedComputedRows;
}

/**
 * Determine if the object is empty
 * All properties equal null
 * @param  {Object}  obj
 * @return {Boolean}
 */
function _isEmptyObject (obj) {
  var keys       = Object.keys(obj);
  var countNulls = 0;

  for (var i = 0; i < keys.length; i++) {
    if (obj[keys[i]] === null) {
      countNulls++;
    }
  }

  return countNulls === keys.length;
}

/**
 * Convert SQL rows to js object(s) according to a model
 * @param  {Array} rows, SQL rows
 * @param  {Object} model
 * @return {Array/Object}
 */
argile.convert = function convert (rows, model) {
  var id = _searchId(model);
  //Todo return error if id === null
  var computedRows = _computeRows(id, rows);

  var keys = Object.keys(model);
  var res  = [];
  var obj  = {};
  var keyValue;

  for (var j = 0; j < computedRows.length; j++) {
    for (var i = 0; i < keys.length; i++) {
      keyValue = model[keys[i]];

      if (/\*/.test(keyValue)) {
        keyValue = keyValue.slice(1);
      }

      if (typeof keyValue === 'object') {
        if (Array.isArray(keyValue)) {
          keyValue     = keyValue[0];
          obj[keys[i]] = argile.convert(computedRows[j], keyValue);
        } else {
          obj[keys[i]] = argile.convert(computedRows[j], model[keys[i]]);
          obj[keys[i]] = obj[keys[i]].length ? obj[keys[i]][0] : null;
        }
      } else {
        obj[keys[i]] = computedRows[j][0][keyValue];
      } 
    }

    if (!_isEmptyObject(obj)) {
      res.push(obj);
    }

    obj = {};
  }

  return res;
};

module.exports = argile;

var argile = {};

/**
 * Convert SQL rows to js object(s) according to a model
 * @param  {Array} rows, SQL rows
 * @param  {Object} model
 * @return {Array/Object}
 */
argile.convert = function convert (rows, model) {
  var keys = Object.keys(model);
  var res = [];
  var obj = {};
  var keyValue;

  for (var j = 0; j < rows.length; j++) {
    for (var i = 0; i < keys.length; i++) { 
      keyValue = model[keys[i]];

      if (typeof keyValue === 'object') {
        obj[keys[i]] = argile.convert([rows[j]], model[keys[i]])[0];
      } else {
        obj[keys[i]] = rows[j][keyValue];
      }
      
    }
    
    res.push(obj);
    obj = {};
  }
  return res;
};

module.exports = argile;

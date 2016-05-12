var argile = {};

/**
 * Convert SQL rows to js object(s) according to a model
 * @param  {Array} rows, SQL rows
 * @param  {Object} model
 * @return {Array/Object}
 */
argile.convert = function convert (rows, model) {
  var keys = Object.keys(model);
  var res = {};
  var keyValue;
  for (var i = 0; i < keys.length; i++) {
    keyValue = model[keys[i]];

    if (/\*/.test(keyValue)) {
      keyValue = keyValue.replace(/\*/, '');
    }
    
    res[keys[i]] = rows[keyValue];
  }
  return res;
};

module.exports = argile;

/*
  * = primary key
  
  model = ['object', {
    id : '*id',
    label : 'label'
  }]

 */

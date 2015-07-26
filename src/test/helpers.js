module.exports = {
  stringify: stringify,
  isEqual: isEqual
};

function stringify(obj) {
  return JSON.stringify(obj, null, 2);
}

function isEqual(a, b) {
  var ta = typeof a;
  var tb = typeof b;
  var i, min, ka, kb, key;

  if (ta == 'undefined' && tb == 'undefined'){
    //console.log('%s === %s', a, b);
    return true;
  }

  if (ta !== tb) {
    //console.log('types do not match. %s (%s) !== %s (%s)', a, ta, b, tb);
    return false;
  }

  if (Array.isArray(ta)) {
    min = Math.min(a.length, b.length);
    for (i = 0; i < min; i++) {
      //console.log('arrays are not equal. a[%d] (%s) !== b[%d] (%s)', i, a[i], i, b[i]);
      if (!isEqual(a[i], b[i])) return false;
    }

  } else if (ta == 'object') {
    if (!a && !b) {
      //console.log('null values match. %s === %s', a, b);
      return true;
    }

    ka = Object.keys(a);
    kb = Object.keys(b);

    if (ka.length != kb.length) return false;

    for (i = 0; i < ka.length; i++) {
      key = ka[i];
      if (!isEqual(a[key], b[key])){
        //console.log('objects are not equal. a[%s] (%s) !== b[%s] (%s)', key, a[key], key, b[key]);
        //console.log('%j', a);
        //console.log('%j', b);
        return false;
      }
    }

  }

  return true;
}

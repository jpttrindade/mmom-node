var a;

function X () {
  a = 10;
}


X.prototype.setA = function (value) {
  a = value
}

X.prototype.getA = function () {
  return a;
}


module.exports = X;

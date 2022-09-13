module.exports = function compose(...funcs) {
  const len = funcs.length;
  if (len === 0) return args => args;
  if (len === 1) return funcs[0];
  return funcs.reduce(
    (total, cur) =>
      (...args) =>
        total(cur(...args))
  );
};

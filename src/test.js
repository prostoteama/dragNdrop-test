const sum = (first) => {
  const sum = {el: first};
  console.log(first);

  const func = (num) => {
    sum.el += num;
    console.log(num);
    return func;
  };
  
  return func;
};

sum(1)(2)(3)(4);

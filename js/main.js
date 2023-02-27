function priority(operation) {
  if (operation == "+" || operation == "-") {
    return 1;
  } else {
    return 2;
  }
}

function isNumeric(str) {
  return /^\d+(.\d+){0,1}$/.test(str);
}

function isDigit(str) {
  return /^\d{1}$/.test(str);
}

function isOperation(str) {
  return /^[\+\-\*\/]{1}$/.test(str);
}

function tokenize(str) {
  let tokens = [];
  let lastNumber = "";
  for (char of str) {
    if (isDigit(char) || char == ".") {
      lastNumber += char;
    } else {
      if (lastNumber.length > 0) {
        tokens.push(lastNumber);
        lastNumber = "";
      }
    }
    if (isOperation(char) || char == "(" || char == ")") {
      tokens.push(char);
    }
  }
  if (lastNumber.length > 0) {
    tokens.push(lastNumber);
  }
  return tokens;
}

function compile(str) {
  let out = [];
  let stack = [];
  for (token of tokenize(str)) {
    if (isNumeric(token)) {
      out.push(token);
    } else if (isOperation(token)) {
      while (
        stack.length > 0 &&
        isOperation(stack[stack.length - 1]) &&
        priority(stack[stack.length - 1]) >= priority(token)
      ) {
        out.push(stack.pop());
      }
      stack.push(token);
    } else if (token == "(") {
      stack.push(token);
    } else if (token == ")") {
      while (stack.length > 0 && stack[stack.length - 1] != "(") {
        out.push(stack.pop());
      }
      stack.pop();
    }
  }
  while (stack.length > 0) {
    out.push(stack.pop());
  }
  return out.join(" ");
}

function evaluate(str) {
  const notation = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
  };
  let stack = [];
  compile(str)
    .split(" ")
    .forEach((token) => {
      if (token in notation) {
        let [y, x] = [stack.pop(), stack.pop()];
        stack.push(notation[token](x, y));
      } else {
        stack.push(parseFloat(token));
      }
    });

  return stack.pop();
}

function clickHandler(event) {
  let screen = document.querySelector("#screen");
  if (event.target.value != NaN) {
    screen.value += event.target.textContent;
    if (event.target.textContent == "=") {
      screen.value = evaluate(screen.value);
    }
    if (event.target.textContent == "C") {
      screen.value = "";
    }
  }
}

let buttons = document.querySelectorAll(".key");
let output = document.querySelector(".buttons");
window.onload = function () {
  output.onclick = clickHandler;
};

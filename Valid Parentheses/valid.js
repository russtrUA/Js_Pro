//Написать функцию валидации правильно открывающихся и закрывающихся скобок в строке, состоящей из символов скобок
var isValid = function (s) {
    var parentheses = '{}()[]',
        stack = [],
        char,
        pos,
        last;
    for (char of s) {
        pos = parentheses.indexOf(char);
        if (pos % 2 === 0) {
            stack.push(pos);
        } else {
            last = stack.pop();
            if (pos - last !== 1) {
                return false;
            }
        }
    }
    if (stack.length) {
        return false
    } else {
        return true
    }
};
window.addEventListener("load", function () {
    var input = document.getElementById('txtInput'),
        btn = document.getElementById('btnValid'),
        output = document.getElementById('message');
    btn.addEventListener("click", function () {
        output.innerHTML = isValid(input.value);
    })

})

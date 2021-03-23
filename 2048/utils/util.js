function templateStr(template, attributes) {
    for(var prop in attributes) {
        if(attributes.hasOwnProperty(prop)) {
            template = template.replace('{{' + prop + '}}', attributes[prop]); 
        }
    }

    return template;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getColumn (arr, column) {
    var i, result = [];
    for (i = 0; i < arr.length; i += 1) {
        result.push(arr[i][column]);
    }
    return result;
}
function setColumn(matrix, newColumn, column) {
    var i;
    for (i = 0; i < matrix.length; i +=1) {
        matrix[i][column] = newColumn[i];
    }
}
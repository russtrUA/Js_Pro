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
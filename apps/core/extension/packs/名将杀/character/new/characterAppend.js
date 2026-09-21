const characterAppend = {
    
};
function addStyleCenter(content) {
    let styleCenter = `<span style=\"font-family: huangcao\">“${content}”</span>`;
    return styleCenter;
}
Object.keys(characterAppend).forEach(key => characterAppend[key] = addStyleCenter(characterAppend[key]));
export default characterAppend;

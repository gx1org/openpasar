export const insertAtCursor = (selector, myValue) => {
  const myField = document.querySelector(selector)
  if (!myField) return;
  let newValue = myField.value
  if (myField.selectionStart || myField.selectionStart == 0) {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    newValue = myField.value.substring(0, startPos)
      + myValue
      + myField.value.substring(endPos, myField.value.length);
  } else {
      newValue += myValue;
  }
  myField.value = newValue
}

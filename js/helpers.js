export function makeElem(elemName, elemClasses) {
  const elem = document.createElement(elemName);
  if (Array.isArray(elemClasses)) {
    elemClasses.forEach((name) => {
      elem.classList.add(name);
    });
  }
  return elem;
}

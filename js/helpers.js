export function makeElem(elemName, elemClasses = "") {
  const elem = document.createElement(elemName);
  if (Array.isArray(elemClasses)) {
    elemClasses.forEach((name) => {
      elem.classList.add(name);
    });
  } else if (typeof elemClasses === "string" && elemClasses.length !== 0)
    elem.classList.add(elemClasses);
  return elem;
}

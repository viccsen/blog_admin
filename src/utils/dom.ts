export function addClass(dom, className) {
  if (dom && className) {
    if (dom.classList) {
      dom.classList.add(className);
    } else {
      dom.className += ' ' + className;
    }
  }
}

export function removeClass(dom, className) {
  if (dom && className) {
    if (dom.classList) {
      dom.classList.remove(className);
    } else {
      const cns = dom.className.split(/\s+/);
      const index = cns.indexOf(className);
      if (index >= 0) {
        cns.splice(index, 1);
        dom.className = cns.join(' ');
      }
    }
  }
}

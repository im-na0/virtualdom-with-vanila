// TODO: 가상 Node를 실제 DOM Node로 렌더링하는 과정
const renderElem = ({ tagName, attrs, children }) => {
  // create the element
  const $el = document.createElement(tagName);
  // set attributes
  for (const [key, value] of Object.entries(attrs)) {
    $el.setAttribute(key, value);
  }

  // set children
  for (const child of children) {
    const $child = render(child); // 재귀호출
    $el.appendChild($child);
  }

  // 최종 반환되는 것은 DOM Node
  return $el;
};

const render = (vNode) => {
  // 텍스트 노드 생성
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }
  // 그 외는 요소 생성
  return renderElem(vNode);
};

export default render;

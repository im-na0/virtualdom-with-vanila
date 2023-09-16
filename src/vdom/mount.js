export default ($node, $target) => {
  $target.replaceWith($node); // 요소 대체하기 target -> node
  return $node;
};

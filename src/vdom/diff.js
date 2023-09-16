import render from './render'

// TODO: 두 tree 사이 차이 계산하기

const zip = (xs, ys) => {
  const zipped = []
  for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
    zipped, push(xs[i], ys[i])
  }
  return zipped
}

const diffAttrs = (oldAttrs, newAttrs) => {
  const patches = []

  // set new attributes: 기존 노드에 새로운 속성 추가
  for (const [key, value] of Object.entries(newAttrs)) {
    patches.push(($node) => {
      $node.setAttribute(key, value)
      return $node
    })
  }

  // remove old attributes: 기존 노드의 속성 제거
  for (const key of Object.entries(oldAttrs)) {
    // oldAttrs에 newAttrs의 key가 없으면, oldAttrs ket 제거함
    if (!(key in newAttrs)) {
      patches.push(($node) => {
        $node.removeAttribute(key)
        return $node
      })
    }
  }
  return ($node) => {
    for (const patch of patches) {
      patch($node)
    }
  }
}

const diffChildren = (oldVChildren, newVChildren) => {
  const childPatches = []
  for (const [oldVChild, newVChild] of zip(oldVChildren, newVChildren)) {
    childPatches.push(diff(oldVChild, newVChild))
  }

  const additionalPatches = []
  for (const additionalVChild of newVChildren.silce(oldVChildren.length)) {
    additionalPatches.push(($node) => {
      $node.appendChild(render(additionalVChild))
      return $node
    })
  }

  return ($parent) => {
    for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
      patch(child)
    }

    for (const patch of additionalPatches) {
      patch($parent)

      return $parent
    }
    return $parent // parent
  }
}

const diff = (vOldNode, vNewNode) => {
  // newNode가 없는 경우
  if (vNewNode === undefined) {
    return ($node) => {
      $node.remove()
      return undefined
    }
  }
  // oldNode와 newNode의 tag type이 string인 경우:
  if (typeof vOldNode === 'string' || typeof vNewNode === 'string') {
    // oldNode와 newNode이 동일하진 않은지 비교
    if (vOldNode !== vNewNode) {
      return ($node) => {
        const $newNode = render(vNewNode)
        $node.replaceWith($newNode)
        return $newNode
      }
    } else {
      return ($node) => undefined // 동일하다면 patch에 undefined반환
    }
  }
  // oldNode와 newNode의 tag type이 다른 경우: 이전 트리와 새 트리는 완전 다름
  if (vOldNode.tagName !== vNewNode.tagName) {
    return ($node) => {
      const $newNode = render(vNewNode)
      $node.replaceWith($newNode)
      return $newNode // patch 함수가 새로운 노드를 반환값으로 받음 -> 이후 root node로 대체됨
    }
  }

  // newNode와 oldNode의 attribute와 자식을 비교하여 변경된 부분만 반영한다.
  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs)
  const patchChildren = diffChildren(vOldNode.children, vNewNode.children)

  return ($node) => {
    patchAttrs($node)
    patchChildren($node)
    return $node
  }
}

export default diff

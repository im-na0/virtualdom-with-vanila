import createElement from "./vdom/createElement";
import render from "./vdom/render";
import mount from "./vdom/mount";
import diff from "./vdom/diff";

// TODO #1: 가상 DOM 만들기
const createVApp = (count) =>
  createElement("div", {
    attrs: {
      id: "app",
      dataCount: count,
    },
    children: [
      String(count),
      createElement("img", {
        attrs: { src: "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif" },
      }),
    ],
  });
let count = 0;
let vApp = createVApp(count);
// TODO #2: 가상DOM Node를 실제 DOM Node로 변환하기
const $app = render(vApp);

// TODO #3: 실제 페이지에 렌더링하기 (마운트 작업)
let $rootEl = mount($app, document.getElementById("app"));

// TODO #4: 매초 마다 리렌더링하기 (마운트 작업)
// TODO #5: 가상 DOM의 diff 알고리즘 구현하기(전체 리렌더 방지)
setInterval(() => {
  count++;
  const vNewApp = createVApp(count);
  const patch = diff(vApp, vNewApp); // 기존 가상DOM, 새로운 가상DOM을 diff 함수에서 처리해줌
  $rootEl = patch($rootEl); // 비교해서 바뀐 부분 '일부분'만 렌더링 해줄 것, 최종적으로 root el에도 업데이트
  vApp = vNewApp; // 다시 기존 가상DOM에 새로운 가상DOM 덮어쓰기
}, 1000);

console.log($app);

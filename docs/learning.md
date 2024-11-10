# 학습

코칭 소스페소는 다양한 낯선 개념과 기술을 사용하고 있습니다. 그래서 여기서는 학습할 자료나 문서, 글, 개념 등을 추천합니다.

## Typescript

정적 타입 언어의 특성을 잘 살려서 개발하기는 쉽지 않습니다. 그냥 빨간 줄만 피하려고 개발하다보면, 오히려 안티 패턴이 많아지기도 합니다.

Matt 선생님의 [무료 강의](https://www.totaltypescript.com/tutorials)와 [무료 책](https://www.totaltypescript.com/books/total-typescript-essentials)을 추천합니다.

하스켈 개발자인 Alexis King의 [검증하지 말고 파싱하라](https://eatchangmyeong.github.io/2022/12/04/parse-don-t-validate.html)도 추천합니다. 외부에서 값이 들어올 때 스키마나 invariant 등을 이용해서 우리 시스템 안의 믿을 수 있는 값으로 변환하는 게 중요합니다.

## React

리액트는 [리액트 공식 문서](https://ko.react.dev/learn)보다 나은 자료가 없습니다. 공식 문서가 어렵다고 강의를 찾아보려 하지만, 잘못되거나 시대에 뒤떨어진 강의들이 많습니다. 공식 한국어 번역도 있으니 영어판과 같이 보시면 좋습니다.

특히 [리액트로 생각하기](https://ko.react.dev/learn/thinking-in-react), [컴포넌트를 순수하게 유지하기](https://ko.react.dev/learn/keeping-components-pure), [리액트의 규칙 Rules of React](https://ko.react.dev/reference/react#rules-of-react)을 추천합니다. 리액트 뿐만 아니라 함수형 철학 자체에 대해 이해를 키우는데 도움이 되실 겁니다.

## Astro와 웹 표준

저희는 HTML, CSS 뿐만 아니라 WAI-ARIA와 같은 다양한 웹표준에 깊이 의존하고 있습니다. Astro는 이러한 웹표준 위에서 매끄럽게 개발할 수 있게 도와줍니다.


웹표준의 중요성은 여러번 강조해도 지나치지 않습니다. [아스트로 공식문서](https://docs.astro.build/en/getting-started/)와 함께 [web.dev](https://web.dev/learn)를 추천합니다.

## 스타일링 : Tailwind와 DaisyUI

tailwind도 결국 CSS 기반이긴 하지만, tailwind와 DaisyUI 자체의 특수한 성질도 있습니다.

[테일윈드 공식 문서](https://tailwindcss.com/docs/utility-first)는 정말 잘 되어 있습니다. 저는 CSS를 공부할 때에도 tailwind 문서의 예제들을 보고 공부했을 정도니까요.

[데이지 UI](https://daisyui.com/components/)의 다양한 컴포넌트들도 구경해보시고 참고하시길 권해드립니다.

## 스키마 valibot

앞서 스키마를 이야기했는데요. 저희는 valibot을 쓰고 있고, 특히 [valibot 공식 문서](https://valibot.dev/guides/pipelines/)에서 v.pipe()를 이용한 파이프라인 개념을 잘 이해하시면 좋습니다.

## 폼

## 의존성 주입과 인터페이스 의존성 설계

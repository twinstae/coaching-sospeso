# 스타일링 : tailwindcss + daisyui

상태 : proposed

## 역사

### 2024년 10월 18일 탐정토끼가 일단 tailwindcss + daisyui로 시작함

## 맥락과 이유

저희는 현재 Astro로 SSR 풀스택을 하고 있습니다. Astro를 버리더라도, SEO 등을 생각하면 서버 렌더링은 필요합니다. 따라서 CSR만 지원하는 상당수의 CSS in JS 라이브러리를 보류합니다.

빠르게 개발하려면 기본적인 디자인을 제공해주는 외부 라이브러리를 쓰는 게 좋습니다. Shadcn이나 ChakraUI, Material UI 등이 있습니다.

Astro에서 사용하려면 React에서만 사용 가능한 라이브러리들도 안 됩니다.

스타일과 기능을 엮기 보다는, 분리하고 싶습니다. 특히 헤드리스 컴포넌트 라이브러리와 조합하기 쉬우면 좋겠습니다.

PandaCSS 등은 훌륭하지만, 디자인 시스템을 직접 만드는데 더 적합합니다. ParkUI 등의 프리셋이 있긴 하지만 ArkUI 와 엮여져 있기도 하고, headless component 들과 같이 사용하려면 머리를 좀 써야 합니다.

panda를 실무에서 사용해보니 디자인 시스템과 자동완성은 정말 훌륭했지만, object 형태의 문법이나 styled component 같은 방식은 호불호가 갈렸습니다.

## 결정

잠정적으로 tailwind css와 daisyui로 결정합니다.

daisyui는 기능보다는 스타일과 웹표준에 집중합니다. ArkUI나 Ariakit과 같은 헤드리스 컴포넌트 라이브러리와 같이 쓰기도 좋습니다.

panda와 달리 디자인 시스템을 위한 기능이 좀 부실하지만, tailwind merge나 class-variance-authority 등을 같이 사용하면 panda css와 비슷하게 개발할 수도 있습니다.

tailwind는 class가 많아지고 못생겨지는 단점이 있는데, daisyui를 쓰면 이러한 문제가 대부분 해결됩니다.

## 유보

나중에 다른 스타일링 기술로 이사를 갈 수도 있으니, 일부 예외를 제외하면 shared component로 되도록 감싸서 daisyui 의존성을 숨기도록 합니다.
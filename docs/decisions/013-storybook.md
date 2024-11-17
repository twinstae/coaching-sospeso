# 스토리북 : Storybook

상태 : proposed

## 역사

### 2024년 10월 18일 탐정토끼가 일단 storybook으로 시작함

## 맥락과 이유

외부 의존성을 신경 쓰지 않고 컴포넌트 단위로 다양한 UI의 경우의 수를 보면서 개발해야 할 때가 있습니다. 테스트로 경우의 수마다 로직을 검증할 수는 있지만, CSS 등은 쉽지 않습니다. 이런 때 스토리북은 큰 도움이 됩니다.

스토리북은 여러 유사 대체제들이 있습니다. Histoire나 ladle, astrobook 등이죠. 하지만 Histoire는 react를 지원하지 않고요. react-cosmos나 ladle은 react만 지원합니다.

## 결정

일단 storybook을 사용하기로 합니다. storybook은 무겁고 아쉬운 점이 있지만, vite builder가 나오고 나서는 꽤 쓸만해졌다고 들었습니다. 무엇보다 storybook은 생태계가 크다는 점도 장점입니다.

## 유보

storybook은 표준 스토리 포맷을 만들어서 여러 스토리북 대체제에서도 비슷하게 사용할 수 있습니다. (astrobook이라거나) 나중에 성능 문제로 이사를 가더라도 큰 문제는 없을 것입니다.
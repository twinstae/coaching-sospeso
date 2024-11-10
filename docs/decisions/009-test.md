# 테스트 : vitest + @testing-library + siheom + playwright

상태 : proposed

## 역사

### 2024년 10월 18일 탐정토끼가 vitest browser mode 기반으로 시작함

## 맥락과 이유

코칭 소스페소의 책임자인 탐정토끼는 세간에 테스트 전도사로 알려져 있습니다. 정적 타입 체크만으로는 true false를 헷갈린다거나 여러 에러를 잡아내지 못합니다. 정적 타입 체크를 더 믿기 위해서도, 테스트를 통해 엄밀하게 검증된 타입 안전한 코드들이 필요합니다.

jest는 셋업도 어렵지만, 우리는 vite를 사용하기 때문에 vite와 잘 통합된 vitest를 사용하려 합니다.

bun test runner는 정말 빠르지만, unit test만 빠르고요. component test나 action test로 가면 다른 병목이 더 많기 때문에 큰 차이가 없었습니다.

무엇보다 프론트 테스트는 jsdom이 아니라 실제 브라우저에서 돌려야 할 많은 이유가 있습니다.

## 결정

백엔드와 프론트의 테스트에 vitest를 사용합니다. component test는 testing-library를 감싼 siheom을 이용합니다.

playwright도 추후에 siheom으로 감싸서 component test와 동일한 인터페이스로 테스트할 수 있게 하려 합니다.

## 유보

아직 vitest browser mode는 실험적인 기능입니다. playwright 브라우저도 설치해야 해서 github action 등에서 실행하려면 시간이 오래 걸립니다. 이를 극복할 방법을 찾아보려 합니다.
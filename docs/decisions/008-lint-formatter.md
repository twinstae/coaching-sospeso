# 린트와 포매터 : eslint + prettier

상태 : proposed

## 역사

### 2024년 10월 18일 탐정토끼가 일단 eslint + prettier로 시작함

## 맥락과 이유

성능이 빠른 oxc나 biome 등을 사용하고 싶었습니다만. 아직 astro에서는 공식적으로 eslint와 prettier만 지원합니다. oxc가 astro를 지원하긴 하지만 script 부분만이고, jsx나 html 은 아닙니다.

## 결정

eslint와 prettier를 사용합니다.

## 유보

oxc나 biome이 astro를 잘 지원하게 되면 갈아타려 합니다.
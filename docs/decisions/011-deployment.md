# 배포 : vercel

상태 : proposed

## 역사

### 2024년 11월 2일 탐정토끼가 일단 vercel에 배포함

## 맥락과 이유

저희는 Astro fullstack을 하고 있고요. 정적 사이트가 아니기 때문에 서버 배포와 관리를 신경 써야 합니다.

직접 무중단부터 CDN, DB 등을 하나하나 AWS로 직접 관리하는 건 어렵고 힘겨운 일입니다.

그렇게 살고 싶긴 않기 때문에 [SST](https://docs.astro.build/ko/guides/deploy/sst/) 같은 IaC를 이용해 aws에 직접 배포할 수도 있고요.

netlify나 cloudflare 등의 서비스를 이용해서 편하게 살 수도 있습니다.

## 결정

vercel에 서버리스로 배포합니다. 다른 서비스와 비슷하게 git만 연결하면 쉽게 배포할 수 있고, Astro 팀도 지원을 잘 해주고 있습니다. 여러 설정도 편리하고, 저 역시 실무에서 다뤄본 경험도 있습니다.

## 유보

Astro는 Next와 달리 vercel에 종속적이지 않습니다. vercel에 특수한 부분을 최대한 명확하게 하고, 언제든지 다른 플랫폼으로 갈아탈 수 있게 하려 합니다.
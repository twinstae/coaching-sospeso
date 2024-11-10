# 코칭 소스페소

## 명령어


| Command                    | Action                                             |
| :------------------------- | :------------------------------------------------- |
| `pnpm install`             | 의존성을 설치합니다.                               |
| `pnpm dev`                 | 개발 서버를 열어줍니다.                            |
| `pnpm build`               | 배포할 사이트를 `./dist/`에 빌드합니다.            |
| `pnpm preview`             | 빌드한 사이트를 배포 전에 미리보기할 수 있습니다.  |
| `pnpm lint`                | 코드에 문제가 있는지 린트를 돌립니다.              |
| `pnpm format`              | 코드 모양을 일관적으로 포맷합니다.                 |
| `pnpm astro ...`           | `astro add`, `astro check` 같은 명령어들           |
| `pnpm unit ...`            | unit과 component test를 돌립니다.                  |
| `pnpm e2e ...`             | playwright로 backend를 포함한 e2e test를 돌립니다. |
| `pnpm storybook ...`       | 스토리북 서버를 엽니다.                            |
| `pnpm build-storybook ...` | 스토리북을 빌드합니다.                             |

## 개발환경 셋업

### 의존성 설치

node는 nvm이나 asdf 등으로 이미 설치했다고 가정합니다. pnpm 으로 패키지 의존성을 설치합니다.

```bash
# pnpm을 설치하지 않았으면 설치합니다.
# npm i -g pnpm
pnpm install
```

vitest browser mode 테스트를 돌리려면 [playwright의 test 용 브라우저](https://playwright.dev/docs/browsers)를 설치해야 합니다.

```bash
pnpm exec playwright install
# linux나 WSL 인 경우
# pnpm exec playwright install --with-deps
```

### 로컬 테스트 DB

저희는 오픈소스이고 프로덕션 DB 크레덴셜은 보안을 위해 공개하지 않고, 로컬 디비로 개발을 해야 합니다. 그러한 이유로 모든 개발을 로컬에서 테스트할 수 있게 셋업을 했습니다.

먼저 SQLite 로 로컬 테스트 DB를 만들고 마이그레이션을 해줘야, actions를 drizzle orm으로 통합 테스트를 할 수 있습니다. [drizzle-kit](https://orm.drizzle.team/docs/tutorials/drizzle-with-turso#applying-changes-to-the-database) 이 로컬 db를 바라보게 설정되어 있습니다.

```bash
pnpm drizzle-kit push
```

그러면 이제 테스트를 실행해볼 수 있습니다.

```bash
pnpm unit
```

## 다음에는?

- [원칙](https://github.com/twinstae/coaching-sospeso/blob/main/docs/principle.md)
- [프로젝트 아키텍처 구조](https://github.com/twinstae/coaching-sospeso/blob/main/docs/architecture.md)
- [학습하기](https://github.com/twinstae/coaching-sospeso/blob/main/docs/learning.md)
import GhostContentAPI from "@tryghost/content-api";
import { marked } from "marked";
import { secretEnv } from "@/adapters/env.secret.ts";
export const ghostClient = new GhostContentAPI({
  url: "https://ghost.life-lifter.com",
  key: secretEnv.GHOST_CONTENT_API_KEY,
  version: "v5.0",
});

export type ContentApiI = {
  getCoachProfilePage(): Promise<string>; // markdown
};

export const ghostContentApi: ContentApiI = {
  async getCoachProfilePage() {
    return ghostClient.pages
      .read({ slug: "coaches" })
      .then((result) => `<h1>${result.title}</h1>\n${result.html ?? ""}`);
  },
};

export const fakeContentApi: ContentApiI = {
  async getCoachProfilePage() {
    return marked.parse(`# 코치들 소개

## 김태형

to be continue…….

asap…..

## 이시은

삶과 환경의 지속 가능성을 추구하는 코치이자 비정기적 석사 연구자, 전직 국어 강사. 대학교 때에는 세상이 돌아가는 구조를 알기 위해 경영학을 전공하며 방구석에서는 사회과학 이론들을 공부했다.

자신의 일상에서 겪는 문제들을 해석하고 설명하는 언어들을 수집해온 결과, 대학원에서는 여성학을 전공하고 정신역학 및 성인의 심리적 발달 이론, 관계 개선을 위한 비폭력대화 스킬을 탐구했다.

자신이 그동안 학생들에게 국어를 가르칠 때 사용한 스킬들이 코칭 방법론들과 많은 부분 맞닿아있다는 점을 발견하고, 더 많은 사람들의 지속가능한 삶을 함께하고 싶어 코칭에 흥미를 갖기 시작했다.

구성주의적 관점을 토대로 사회를 바라보고, 모든 사람들이 경계와 틀에 갇히지 않고 행복할 수 있는 세상을 꿈꾸고 있다.


## 김태희

삶을 풍요롭게 하는 코치이자 웹 프로그래머입니다. 트위터에서는 탐정토끼로 살고 있습니다.

중학교 때에는 혁명가가 되고 싶었습니다. 고등학교 때에는 노동 변호사 이한 선생님의 노동과 탈학교 운동 책을 읽으며 정의로운 세상을 꿈꿨고요. 좋은 선생님이 되고 싶었지만 수능을 망쳐서 사범대에 떨어졌습니다. 물리가 좋아서 물리학과를 나왔지만, 코딩으로 먹고 살고 있습니다. 

배민 커넥트를 하면서 취준을 하다가 같이 스터디를 했던 사람들이 잘 되는 걸 보고 코칭을 시작했습니다. 사회 구조와 시스템에 대한 생각을 가지고 학습과학과 심리치료, 전문가 연구 등을 읽어왔습니다. 따뜻한 응원과 현실적인 행동을 모토로 코칭을 합니다.

불평등한 고액 서비스가 될 수 밖에 없는 교육/심리치료 산업에 회의를 느끼고 3천 3백원 짜리 코칭을 하던 중... 노동자 자주 기업, 민주적 협동조합, 커먼즈, 사회적 돌봄 경제 같은 키워드에 매력을 느껴서 라이프리프터에 합류하고 오픈소스로 코칭 소스페소를 만들기 시작했습니다.`);
  },
};

import { describe, expect, test } from "vitest"
import { testAccount } from "./fixtures"
import { deriveBalanceSheet } from "./derive.ts"

// 재무상태표
// 자산 -> 자산 총계
    // 유동 자산 총계
    // 비유동자산 총계
      // 유형 총계, 무형 총계
// 부채 + 자본 -> 부채 총계, 자본 총계, 부채와 자본 총계
    // 유동부채, 비유동부채
    // 자본금, 자본 잉여금, 이익 잉여금, 기타 포괄손익누계액 

// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy

describe("accounting derive", () => {
    
  test("분류 계층별로로 총계를 구할 수 있다", () => {
    expect(deriveBalanceSheet(testAccount)).toMatchObject({
      asset: {
        totalAmount: 190000,
        "유동자산": {
          totalAmount: 70000,
          "현금및현금성자산": {
            totalAmount: 70000
          }
        },
        "비유동자산": {
          totalAmount: 120000,
          유형자산: {
            totalAmount: 120000,
            "기계장치": {
              totalAmount: 120000,
            }
          }
        }
      },
      debtAndCapital: {
        totalAmount: 190000,
        debt: {
          totalAmount: 60000,
          유동부채: {
            totalAmount: 60000,
            "미지급금": {
              totalAmount: 60000,
            }
          }
        },
        capital: {
          totalAmount: 130000,
          "자본금": {
            totalAmount: 120000,
          },
          "이익잉여금": {
            totalAmount: 10000,
          }
        }
      }
    })
  })
})
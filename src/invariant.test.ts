import { describe, expect, test } from 'vitest';
import invariant from './invariant';

describe("invariant", () => {
    test("true이면 괜찮다", () => {
        expect(() => {
            invariant(1 + 1 === 2, "1+1은 2에요!");
        }).not.toThrow();
    });

    test("거짓이면 에러를 뱉는다", () => {
        expect(() => {
            const mustExist = undefined
            invariant(mustExist, "존재하지 않아요!");
        }).toThrow();
    });

    test("함수로 에러메세지를 뱉을 수도 있다", () => {
        expect(() => {
            const mustExist = undefined
            invariant(mustExist, () => "존재하지 않아요!");
        }).toThrow();
    });
});
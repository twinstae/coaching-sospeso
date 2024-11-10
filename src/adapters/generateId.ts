import { nanoid } from "nanoid";

export type generateIdI = () => string;

const NANO_ID_LENGTH = 14;
export const generateNanoId = () => nanoid(NANO_ID_LENGTH);

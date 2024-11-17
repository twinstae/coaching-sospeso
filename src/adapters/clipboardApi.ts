export type ClipboardApiI = {
  copy: (text: string) => Promise<void>;
};

export const browserClipboardApi = {
  copy: (text: string) => {
    return navigator.clipboard.writeText(text);
  },
} satisfies ClipboardApiI;

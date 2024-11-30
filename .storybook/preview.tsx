import React from 'react';
import "../src/index.css"
import type { Preview } from "@storybook/react";
import { ToastifyToastContainer } from "../src/adapters/toastApi.tsx";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div>
      <Story />
      
    <ToastifyToastContainer
      closeOnClick
      autoClose={5000}
      hideProgressBar={true}
      closeButton={false}
      theme=""
    />
      </div>
    ),
  ],
};

export default preview;

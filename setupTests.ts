import { afterEach } from 'vitest';
import "./src/index.css"
import "@testing-library/jest-dom/vitest";
import { cleanup } from '@testing-library/react';

afterEach(() => {
    cleanup()
})
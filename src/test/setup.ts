import {vi} from 'vitest'
import "@testing-library/jest-dom/vitest";


class IntersectionObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();

    constructor(callback: IntersectionObserverCallback) {}
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
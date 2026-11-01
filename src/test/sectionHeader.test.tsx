import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react'
import { SectionHeader } from '../components/Header/sectionHeader.tsx';


describe('SectionHeader',()=>{
    it("It should display passed text as header",()=>{
        const {getByTestId} = render(<SectionHeader title="Dummy Header" size="text-lg" />);

        const headerValue = getByTestId('header').textContent

        expect(headerValue).toBe("Dummy Header")
    })
})
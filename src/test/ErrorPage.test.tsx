import {describe,it,expect} from 'vitest'
import {render} from '@testing-library/react'
import {ErrorPage} from '../components/Pages/ErrorPage.tsx'

describe(ErrorPage,()=>{
    it("it should display custom error text message",()=>{
        const {getByTestId} = render(<ErrorPage msg="Login Page"/>);

        const customErrorTitle = getByTestId('custom-error-title').textContent

        const customErrorMsg = getByTestId('custom-error-info').textContent

        expect(customErrorTitle).toBe("500 Internal Server Error")

        expect(customErrorMsg).toBe("Something Went wrong while connecting to server, kindly try after some time")
    })
})
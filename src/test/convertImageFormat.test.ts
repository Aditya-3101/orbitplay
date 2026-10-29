import {expect,describe,it} from 'vitest'
import {convertImageExtension} from '../utility/covertImageFormat.ts'


describe("replaceExtension",()=>{
    it("converts the Cloudinary image URL", () => {
        expect(
            convertImageExtension("http://res.cloudinary.com/dzdu2gw3u/image/upload/v1774530638/uwb6uvqsin8zpmdtuzqr.webp")
        ).toBe("https://res.cloudinary.com/dzdu2gw3u/image/upload/f_webp/q_auto/w_320/v1774530638/uwb6uvqsin8zpmdtuzqr.webp")
    })
})
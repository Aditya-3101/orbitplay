import { getVideoDuration } from "../utility/videoDuration.ts";
import {expect,describe,it} from 'vitest'


describe("convertSeconds_to_minutes",()=>{
    it("converts the seconds to minutes",()=>{
        expect(getVideoDuration(240)).toBe("04:00")
    })
})
import type {Video} from '../../features/videos/videos.types.ts'

export const MockVideoData:Video[] = [
    {
        _id: "69c5304e50fe76f48ded5711",
        videoFile: "http://res.cloudinary.com/dzdu2gw3u/video/upload/v1774530636/fjyn5bb9gobtwofqkdhw.mp4",
        thumbnail: "http://res.cloudinary.com/dzdu2gw3u/image/upload/v1774530638/uwb6uvqsin8zpmdtuzqr.webp",
        owner: {
            _id: "69a3497b1527d3ab601c718b",
            username: "amklmffrf",
            avatar: "http://res.cloudinary.com/dzdu2gw3u/image/upload/v1791741102/gkicenvwhtdb2qqwlfcv.jpg"
        },
        title: "pallas cat",
        description: "pallas cat captured in their natural habitat",
        duration: 60.103401,
        views: 9,
        isPublished: true,
        createdAt: "2026-03-26T13:10:38.902Z",
        updatedAt: "2026-10-31T08:24:57.213Z",
        __v: 0,
        subscriberCount: 2
    }
]
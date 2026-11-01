import {describe,it,expect, vi, afterEach} from 'vitest';
import {VideoCard} from '../components/Main/VideoCard.tsx'
import {MockVideoData} from './mock/video.mock.ts';
import {render,screen} from'@testing-library/react';
import { MemoryRouter,Routes,Route } from 'react-router-dom';
import {userEvent} from '@testing-library/user-event'
import Player from '../components/Main/Player.tsx'
import {Provider} from 'react-redux'
import {store} from '../app/store/store.ts'
import { api } from '../api/AxiosInstance.ts';


vi.mock('../components/Main/Comments.tsx', () => ({
    Comments: () => null,
}));

describe(VideoCard,()=>{

    it('it should render thumbnail image',()=>{
        render(
            <MemoryRouter>
                <VideoCard data={MockVideoData[0]} index={1} />
            </MemoryRouter>
        )

        const thumbnailImage = screen.getByRole('img',{name:MockVideoData[0].title});

        expect(thumbnailImage).toBeInTheDocument();

        expect(thumbnailImage).toHaveAttribute('src',expect.stringContaining('640'))
    })

    it("it should render video owner's profile picture",()=>{
        render(
            <MemoryRouter>
                <VideoCard data={MockVideoData[0]} index={1} />
            </MemoryRouter>
        )

        const avatar = screen.getByRole('img',{name:MockVideoData[0].owner.username});

        expect(avatar).toBeInTheDocument();

        expect(avatar).toHaveAttribute('src',expect.stringContaining('60'))
    })

    it('it should show video title',()=>{
        const {getByTestId} = render(
            <MemoryRouter>
                <VideoCard data={MockVideoData[0]} index={1} />
            </MemoryRouter>
        )

        const videoTitle = getByTestId('videoCard-video-title').textContent

        expect(videoTitle).toEqual(MockVideoData[0].title)
    })

    it('it should correct show correct video links',()=>{
        render(
            <MemoryRouter>
                <VideoCard data={MockVideoData[0]} index={1} />
            </MemoryRouter>
        )

        const videoLink = screen.getByRole('link',{name:MockVideoData[0].title})

        expect(videoLink).toBeInTheDocument()

        expect(videoLink).toHaveAttribute('href',`/v/${MockVideoData[0]._id}`)
    })

    it('it should shou navigate to correct video links',async()=>{

        vi.spyOn(api,'get',).mockResolvedValue({
            data:{
                data:MockVideoData[0]
            }
        })

        


        const user = userEvent.setup()
        render(
            <Provider store={store}>
            <MemoryRouter initialEntries={['/']}>

                <Routes>
                    <Route
                        path="/"
                        element={
                            <VideoCard
                                data={MockVideoData[0]}
                                index={1}
                            />
                        }
                    />
                    <Route
                        path="/v/:videoId"
                        element={<Player />}
                    />
                </Routes>
            </MemoryRouter>
            </Provider>
        )



        const videoLink = screen.getByTestId('videoCard-nav-link')

        await user.click(videoLink)

        expect(screen.getByTestId("video-title")).toHaveTextContent(MockVideoData[0].title)
    })
})

afterEach(()=>{
    vi.restoreAllMocks()
})
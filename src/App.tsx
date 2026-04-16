import React,{useEffect} from 'react';
import {Route, createBrowserRouter,createRoutesFromElements,RouterProvider, useRouteError} from "react-router-dom";
import {HomeLayout} from './components/Layouts/Home.tsx';
import {MainPage} from './components/Main/MainPage.tsx';
import {ErrorWall} from './components/ErrorBoundry/ErrorWall.tsx';
import { Login } from './components/Auth/Login.tsx';
import {ProtectRoute} from './components/Auth/ProtectRoute.tsx'
import { PublicRoute } from './components/Auth/PublicRoute.tsx';
import { refreshUser} from './components/Auth/Refresh.ts'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "./app/store/store.ts";

const Player = React.lazy(()=>import('./components/Main/Player.tsx'));
const Account = React.lazy(()=>import('./components/Profile/Account.tsx'))
const History = React.lazy(()=>import('./components/Pages/History.tsx'))
const Results = React.lazy(()=>import('./components/Pages/Results.tsx'))
const Subscriptions = React.lazy(()=>import('./components/Pages/Subscriptions.tsx'))
const Playlist = React.lazy(()=>import('./components/Pages/Playlist.tsx'))
const LikedVideos = React.lazy(()=>import('./components/Pages/LikedVideos.tsx'))
const UploadVideo = React.lazy(()=>import('./components/Pages/UploadVideo.tsx'))

interface ErrorResponse {
  code:number;
  status:string;
  message?:string;
  statusText?:string
}

const ErrorBoundry:React.FC = () =>{
  const error = useRouteError() as ErrorResponse
  return <ErrorWall error={error} />
}




const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route element={<ProtectRoute/>}>
    <Route path="/"element={<HomeLayout/>}>
      <Route index element={<MainPage/>} errorElement={<ErrorBoundry/>} />
      <Route path="/v/:videoId" element={<Player/>} errorElement={<ErrorBoundry/>}/>
      <Route path="/videos/search" element={<Results/>} errorElement={<ErrorBoundry/>} />
      <Route path="/account" element={<Account key="account"/>} errorElement={<ErrorBoundry/>} />
      <Route path="/channel/:channelName" element={<Account key="channel" />} errorElement={<ErrorBoundry/>} />
      <Route path="/history" element={<History/>} errorElement={<ErrorBoundry/>} />
      <Route path="/subscriptions" element={<Subscriptions/>} errorElement={<ErrorBoundry/>} />
      <Route path="/playlists/:playlistId" element={<Playlist/>} errorElement={<ErrorBoundry/>} />
      <Route path="/Liked-videos" element={<LikedVideos/>} errorElement={<ErrorBoundry/>} />
      <Route path="/upload" element={<UploadVideo />} errorElement={<ErrorBoundry/>} />
    </Route>
    </Route>
    <Route path='*' element={<h2>Not Found!!!</h2>} />
    <Route element={<PublicRoute/>}>
    <Route path="/login" element={<Login/>} errorElement={<ErrorBoundry/>} />
    </Route>
    </>
  )
)


const App:React.FC = () => {

  const dispatch = useDispatch()

  useEffect(()=>{
    refreshUser(dispatch)
  },[])

  
  const isAuthLoading = useSelector((state: RootState) => state.user.isAuthLoading);
  if (isAuthLoading) {
    return <h2>Loading...</h2>; // or spinner
  }

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App

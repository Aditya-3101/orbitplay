import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../slices/userSlice.ts'
import videoReducer from '../slices/videoSlice.ts'
import channelReducer from '../slices/channelSlice.ts'
import toggleReducer from '../slices/toggleSlice.ts'

export const store = configureStore({
    reducer:{
        user:userReducer,
        video:videoReducer,
        channel:channelReducer,
        toggle:toggleReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
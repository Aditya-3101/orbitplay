import { api } from "../../api/AxiosInterceptor"

export async function logOutSession(param):Promise<void>{
    try {
        const request = await api.post('/users/logout',{})

        if(request.status===200){
            param("/login")
        }
    } catch (error) {
        console.log(error)
    }
}
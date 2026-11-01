import { api } from "../../api/AxiosInstance.ts"

export async function logOutSession(param):Promise<void>{
    try {
        const request = await api.post('/users/logout',{})

        if(request.status===200){
            sessionStorage.removeItem("accessToken");
            param("/login")
        }
    } catch (error) {
        console.log(error)
    }
}
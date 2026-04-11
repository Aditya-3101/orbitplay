import {formatDistanceToNow} from 'date-fns'

export const timeAgo = (paramter:string) => {
    return formatDistanceToNow(new Date(paramter),{
        addSuffix:true
    });
}
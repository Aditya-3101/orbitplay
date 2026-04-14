import {formatDistanceToNow,format, isToday, isYesterday} from 'date-fns'

export const timeAgo = (paramter:string) => {
    return formatDistanceToNow(new Date(paramter),{
        addSuffix:true
    });
}

export const dateAgo = (parameter:string) => {
    const date = new Date(parameter)

    if(isToday(date)) return 'Today'

    if(isYesterday(date)) return 'Yesterday'

    return `${format(date,'dd MMM yyyy')}`
}


export const getVideoDuration = (seconds:number):string =>{
    const hrs:number = Math.floor(seconds / 3600);
    const mins:number = Math.floor((seconds % 3600) / 60);
    const secs:number = Math.floor(seconds % 60);

    const pad = (num: number):string => String(num).padStart(2, '0');

    if (hrs > 0) {
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    return `${pad(mins)}:${pad(secs)}`;
}
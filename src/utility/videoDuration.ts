
export const getVideoDuration = (seconds:number) =>{
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hrs > 0) {
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    return `${pad(mins)}:${pad(secs)}`;
}
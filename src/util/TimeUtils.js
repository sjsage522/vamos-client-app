export function getLastTime(compare, now) {
    let result = parseInt((now - compare) / 1000 / 60 / 60);
    if (result > 24) { //24시간 이상
        result = Math.floor(result / 24);
        if (result > 7) { //7일 이상
            result = `${compare.getFullYear()}. ${compare.getMonth()+1} .${compare.getDate()}`
            // ex) 2021. 10. 27
        } else { //7일 이내
            result = result + '일전' // ex) 5일전
        }
    } else if (result === 0) { //1시간 미만
        if (parseInt((now - compare) / 1000 / 60) === 0) result = '지금';
        else result = Math.floor((now - compare) / 1000 / 60) + '분전';
    } else { //1시간 이상 24시간 미만
        result = result + '시간전';
    }
    return result;
}
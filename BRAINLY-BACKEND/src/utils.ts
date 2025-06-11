export function random(len: number): String {
    let options: String = "qwertyuiopasdfghjklzxcvbnm"
    let ans: String = ""
    for(let i = 0; i < len; i++) {
        ans += options[Math.floor(Math.random() * options.length)]
    }
    return ans;
}
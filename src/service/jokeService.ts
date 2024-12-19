import {JOKE_BASE_URL} from "../config/config";

interface TJoke {
    error: boolean
    category: string
    type: string
    setup: string
    delivery: string
    flags: Flags
    id: number
    safe: boolean
    lang: string
}

interface Flags {
    nsfw: boolean
    religious: boolean
    political: boolean
    racist: boolean
    sexist: boolean
    explicit: boolean
}

export const jokeService = {
    getJoke: async () => {
        const params = new URLSearchParams()
        params.set("blacklistFlags", "religious,political,racist,sexist,explicit")
        params.set("type", "twopart")
        const res = await fetch(`${JOKE_BASE_URL}/Programming,Miscellaneous,Spooky?${params}`)
        const json = await res.json() as TJoke
        return json as TJoke
    }
}
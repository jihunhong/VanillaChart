import { getId } from ".";
import { IMGIX_URL } from "../config/variables";

export const favoriteArtistArrange = (artists) => {
    if(artists) {
        const names = artists?.playlistItems?.map(item => {
             if(item?.music?.artistName) {
                //  return `${IMGIX_URL}/artist-profile/${item?.music?.artistName}.jpg?w=300&ar=1:1&fit=crop&auto=format`
                return item?.music?.artistName;
             }
             return null;
        })
        const uniqueNames: Array<string> = Array.from(new Set(names));
        return uniqueNames.map(name => {
            return {
                src: `${IMGIX_URL}/artist-profile/${encodeURIComponent(name)}.jpg?w=300&ar=1:1&fit=crop&auto=format`,
                artistName: name,
            }
        })
    }
    return [];
}

export const joinArrange = (user) => {
    const { followings } = user;
    const { followers } = user;

    return {
        ...user.toJSON(),
        password: null,
        followers: followers.map(getId),
        followings: followings.map(getId)
    }
    
}
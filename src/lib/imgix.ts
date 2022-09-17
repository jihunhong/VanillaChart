import { IMGIX_URL } from './../config/variables';

export const mappingPlaylistPreview = (data) => {
    const items = data?.playlistItems.map(model => model.get({ plain: true }));
    const set:Set<string> = new Set(items.map(item => item?.music?.albumName));
    const thumbnails = Array.from(set)?.slice(0, 4).map(name => {
        return `${IMGIX_URL}/${name?.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_')}.png?w=600&ar=1:1&fit=crop&auto=format`
    })
    return {
        ...data,
        playlistItems: [],
        // 너무 많은 데이터라서 용량 줄이기위해 빈배열로 반환
        playlistItemCount: data?.playlistItems.length,
        thumbnails
    }
}

export const mappingChartCover = (data) => {
    const rawData = data.map(model => model.get({ plain: true }));
    return rawData?.map(item => {
        if(item?.music?.albumName) {
            const rawAlbumName = item.music.albumName?.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
            return {
                ...item,
                music : {
                    ...item.music,
                    liker: item.music.liker.map(v => v.id).sort(),
                    middleCoverImage : `${IMGIX_URL}/${rawAlbumName}.png?w=600&ar=1:1&fit=crop&auto=format`,
                    smallCoverImage : `${IMGIX_URL}/${rawAlbumName}.png?w=128&ar=1:1&fit=crop&auto=format`
                }
            }
        }
        return {
             ...item, 
            music : {
                ...item.music,
                liker: item.music.liker.map(v => v.id).sort(),
                middleCoverImage : null,
                smallCoverImage : null
            }
        };
    })
}

export const mappingAlbumDetail = (data) => {
    const rawData = data.get({ plain : true });
    const rawAlbumName = data?.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
    const tracks = rawData.music.map(item => {
        return {
            ...item,
            middleCoverImage: `${IMGIX_URL}/${rawAlbumName}.png?w=540&ar=1:1&fit=crop&auto=format`,
            smallCoverImage: `${IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format`
        }
    })
    return {
        ...rawData,
        middleCoverImage: `${IMGIX_URL}/${rawAlbumName}.png?w=540&ar=1:1&fit=crop&auto=format`,
        smallCoverImage: `${IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format`,
        music: tracks
    }
}

export const mappingArtistAlbums = (data) => {
    const rawData = data.map(model => model.get({ plain : true }));
    return rawData?.map(item => {
        if(item?.albumName) {
            const rawAlbumName = item.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
            return {
                ...item,
                middleCoverImage : `${IMGIX_URL}/${rawAlbumName}.png?w=300&ar=1:1&fit=crop&auto=format`,
            }
        }
        return {
            ...item, middleCoverImage: null
        }
    })
}

export const mappingSongs = (data) => {
    const rawData = data.map(model => model.get({ plain: true }));
    return rawData?.map(item => {
        if(item?.albumName) {
            const rawAlbumName = item.albumName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
            return { 
                ...item,
                middleCoverImage : `${IMGIX_URL}/${rawAlbumName}.png?w=300&ar=1:1&fit=crop&auto=format`,
                smallCoverImage : `${IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format`
            }
        }
        return {
             ...item, 
             middleCoverImage : null,
             smallCoverImage : null
        };
    })
}
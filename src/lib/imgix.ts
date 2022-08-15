import { IMGIX_URL } from './../config/variables';

export const mappingChartCover = (data) => {
    const rawData = data.map(model => model.get({ plain: true }));
    return rawData?.map(item => {
        if(item?.music?.albumName) {
            const rawAlbumName = item.music.albumName?.replace(/[`~!@#$%^&*|\\\'\";:\/?]/g, '_');
            return { 
                ...item,
                music : {
                    ...item.music,
                    middleCoverImage : `${IMGIX_URL}/${rawAlbumName}.png?w=300&ar=1:1&fit=crop&auto=format`,
                    smallCoverImage : `${IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format`
                }
            }
        }
        return {
             ...item, 
            music : {
                ...item.music,
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
            middleCoverImage: `${IMGIX_URL}/${rawAlbumName}.png?w=300&ar=1:1&fit=crop&auto=format`,
            smallCoverImage: `${IMGIX_URL}/${rawAlbumName}.png?w=64&ar=1:1&fit=crop&auto=format`
        }
    })
    return {
        ...rawData,
        middleCoverImage: `${IMGIX_URL}/${rawAlbumName}.png?w=300&ar=1:1&fit=crop&auto=format`,
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
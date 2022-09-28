const { Music, Sequelize, Chart, Artist, Album } = require("../models");

(async() => {
    const artists = await Artist.findAll();
    for(const artist of artists) {
        const result = await Album.update({
            artistId: artist.id
        }, {
            where: {
                artistName: artist.artistName
            }
        })
        console.log(result);
    }
})();
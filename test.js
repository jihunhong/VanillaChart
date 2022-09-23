const { userJoinArrange } = require("./src/lib/arrange");
const { User, Playlist, Music } = require("./src/models");

(async() => {
    const user = await User.findOne({ 
        where : { 
            id: 27
        },
        include: [
            {
                model: Playlist,
                attributes: ['pId'],
                as: 'playlists'
            },
            {
                model: Music,
                attributes: ['id'],
                as: 'liked',
            },
            {
                model: User,
                attributes: ['id'],
                as: 'followings',

            },
            {
                model: User,
                attrbiutes: ['id'],
                as: 'followers'
            },
        ],
    });
    console.log(userJoinArrange(user));
})();
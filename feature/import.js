const Playlist = require('../class/Playlist');

const userPlaylist = new Playlist();

userPlaylist.Builder(
    {
        id : 470791337
    }
);

userPlaylist.getList()
    .then((res) => {console.log(res)});
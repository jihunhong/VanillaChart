const Playlist = require('../class/Playlist');

const userPlaylist = new Playlist();

userPlaylist.Builder(
    {
        id : 470791337,
        url : 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm?plylstSeq=470791337'
    }
);

userPlaylist.getList()
    .then((res) => {console.log(res)});
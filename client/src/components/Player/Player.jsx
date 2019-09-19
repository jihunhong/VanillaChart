import React, {Component} from 'react';
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";


  const options = {
    //audio lists model
    audioLists: [
      {
        name: '비올레타',
        singer: '아이즈원',
        cover: 'data:image/jpeg;base64,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',
        musicSrc: 'https://www.youtube.com/watch?v=zndvqTc4P9I'
      },
      {
        name: 'Despacito',
        singer: 'Luis Fonsi',
        cover:
          'http://res.cloudinary.com/alick/image/upload/v1502689731/Despacito_uvolhp.jpg',
        musicSrc: () => {
          return Promise.resolve(
            'http://res.cloudinary.com/alick/video/upload/v1502689683/Luis_Fonsi_-_Despacito_ft._Daddy_Yankee_uyvqw9.mp3'
          )
        }
      },
      {
        name: 'Bedtime Stories',
        singer: 'Jay Chou',
        cover:
          'http://res.cloudinary.com/alick/image/upload/v1502375978/bedtime_stories_bywggz.jpg',
        musicSrc:
          'http://res.cloudinary.com/alick/video/upload/v1502375674/Bedtime_Stories.mp3'
      },
      {
        name: '难得',
        singer: '安来宁',
        cover: '//cdn.lijinke.cn/nande.jpg',
        musicSrc: '//cdn.lijinke.cn/nande.mp3'
      }
    ],
  
    //default play index of the audio player  [type `number` default `0`]
    defaultPlayIndex: 0,
  
    //if you want dynamic change current play audio you can change it [type `number` default `0`]
    // playIndex: 0,
  
    //color of the music player theme    [ type `string: 'light' or 'dark'  ` default 'dark' ]
    theme: 'dark',
  
    // Specifies movement boundaries. Accepted values:
    // - `parent` restricts movement within the node's offsetParent
    //    (nearest node with position relative or absolute), or
    // - a selector, restricts movement within the targeted node
    // - An object with `left, top, right, and bottom` properties.
    //   These indicate how far in each direction the draggable
    //   can be moved.
    bounds: 'body',
  
    //Whether to load audio immediately after the page loads.  [type `Boolean | String`, default `false`]
    //"auto|metadata|none" "true| false"
    preload: false,
  
    //Whether the player's background displays frosted glass effect  [type `Boolean`, default `false`]
    glassBg: false,
  
    //The next time you access the player, do you keep the last state  [type `Boolean` default `false`]
    remember: false,
  
    //The Audio Can be deleted  [type `Boolean`, default `true`]
    remove: true,
  
    //audio controller initial position    [ type `Object` default '{top:0,left:0}' ]
    defaultPosition: {
      top: 300,
      left: 120
    },
  
    // play mode text config of the audio player
    playModeText: {
      order: '연속 재생',
      orderLoop: '리스트 반복',
      singleLoop: '한곡 반복',
      shufflePlay: '랜덤 재생'
    },
  
    //audio controller open text  [ type `String | ReactNode` default 'open']
    openText: '',
  
    //audio controller close text  [ type `String | ReactNode` default 'close']
    closeText: '',
  
    //audio theme switch checkedText  [ type `String | ReactNode` default '-']
    checkedText: 'B',
  
    //audio theme switch unCheckedText [ type `String | ReactNode` default '-']
    unCheckedText: 'W',
  
    // audio list panel show text of the playlist has no songs [ type `String` | ReactNode  default 'no music']
    notContentText: 'none',
  
    panelTitle: 'My Playlist',
  
    defaultPlayMode: 'order',
  
    //audio mode        mini | full          [type `String`  default `mini`]
    mode: 'full',
  
    /**
     * [ type `Boolean` default 'false' ]
     * The default audioPlay handle function will be played again after each pause, If you only want to trigger it once, you can set 'true'
     */
    once: true,
  
    //Whether the audio is played after loading is completed. [type `Boolean` default 'true']
    autoPlay: false,
  
    //Whether you can switch between two modes, full => mini  or mini => full   [type 'Boolean' default 'true']
    toggleMode: true,
  
    //audio cover is show of the "mini" mode [type `Boolean` default 'true']
    showMiniModeCover: true,
  
    //audio playing progress is show of the "mini"  mode
    showMiniProcessBar: false,
  
    //audio controller is can be drag of the "mini" mode     [type `Boolean` default `true`]
    drag: true,
  
    //drag the audio progress bar [type `Boolean` default `true`]
    seeked: true,
  
    //audio controller title [type `String | ReactNode`  default <FaHeadphones/>]
    controllerTitle: String,
  
    //Displays the audio load progress bar.  [type `Boolean` default `true`]
    showProgressLoadBar: true,
  
    //play button display of the audio player panel   [type `Boolean` default `true`]
    showPlay: true,
  
    //reload button display of the audio player panel   [type `Boolean` default `true`]
    showReload: false,
  
    //download button display of the audio player panel   [type `Boolean` default `true`]
    showDownload: false,
  
    //loop button display of the audio player panel   [type `Boolean` default `true`]
    showPlayMode: true,
  
    //theme toggle switch  display of the audio player panel   [type `Boolean` default `true`]
    showThemeSwitch: false,
  
    //lyric display of the audio player panel   [type `Boolean` default `false`]
    showLyric: false,
  
    //Extensible custom content       [type 'Array' default '[]' ]
    extendsContent: [],
  
    //default volume of the audio player [type `Number` default `100` range `0-100`]
    defaultVolume: 75,
  
    //playModeText show time [type `Number(ms)` default `700`]
    playModeShowTime: 800,
  
    //Whether to try playing the next audio when the current audio playback fails [type `Boolean` default `true`]
    loadAudioErrorPlayNext: true,
  

    //audio play handle
    onAudioPlay(audioInfo) {
      console.log('audio playing', audioInfo)
    },
  
    //audio pause handle
    onAudioPause(audioInfo) {
      console.log('audio pause', audioInfo)
    },
  
    //When the user has moved/jumped to a new location in audio
    onAudioSeeked(audioInfo) {
      console.log('audio seeked', audioInfo)
    },
  
    //When the volume has changed  min = 0.0  max = 1.0
    onAudioVolumeChange(currentVolume) {
      console.log('audio volume change', currentVolume)
    },
  
    //The single song is ended handle
    onAudioEnded(audioInfo) {
      console.log('audio ended', audioInfo)
    },
  
    //audio load abort The target event like {...,audioName:xx,audioSrc:xx,playMode:xx}
    onAudioAbort(e) {
      console.log('audio abort', e)
    },
  
    //audio play progress handle
    onAudioProgress(audioInfo) {
      // console.log('audio progress',audioInfo);
    },
  
    //audio reload handle
    onAudioReload(audioInfo) {
      console.log('audio reload:', audioInfo)
    },
  
    //audio load failed error handle
    onAudioLoadError(e) {
      console.log('audio load err', e)
    },
  
    //theme change handle
    onThemeChange(theme) {
      console.log('theme change:', theme)
    },
  
    onAudioListsChange(currentPlayId, audioLists, audioInfo) {
      console.log('[currentPlayId] audio lists change:', currentPlayId)
      console.log('[audioLists] audio lists change:', audioLists)
      console.log('[audioInfo] audio lists change:', audioInfo)
    },
  
    onAudioPlayTrackChange(currentPlayId, audioLists, audioInfo) {
      console.log(
        'audio play track change:',
        currentPlayId,
        audioLists,
        audioInfo
      )
    },
  
    onPlayModeChange(playMode) {
      console.log('play mode change:', playMode)
    },
  
    onModeChange(mode) {
      console.log('mode change:', mode)
    },
  
    onAudioListsPanelChange(panelVisible) {
      console.log('audio lists panel visible:', panelVisible)
    },
  
    onAudioListsDragEnd(fromIndex, endIndex) {
      console.log('audio lists drag end:', fromIndex, endIndex)
    },
  
    onAudioLyricChange(lineNum, currentLyric) {
      console.log('audio lyric change:', lineNum, currentLyric)
    },
  
    // custom music player root node
    getContainer() {
      return document.body
    }
  }
  
  class Player extends Component {
    state = {
      params: options
    }
    
    render() {
      const { params } = this.state
      return (
        <div>
          <ReactJkMusicPlayer {...params} />
        </div>
      )
    }
  }

  export default Player;

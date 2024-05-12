const initialState = {
    mediaUrls: ["http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"],
    currentMediaIndex: 0,
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_MEDIA_URLS':
        return {
          ...state,
          mediaUrls: action.payload,
        };
      case 'SET_CURRENT_MEDIA_INDEX':
        return {
          ...state,
          currentMediaIndex: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default reducer;
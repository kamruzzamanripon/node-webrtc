let state = {
    socketId: null,
    localStream: null,
    remoteStream: null,
    screenSharingActive: false,
    screenSharingStream: null,
    allowConnectionsFromsStrangers: false
};

export const setSocketId = (socketId) =>{
    state = {
        ...state,
        socketId
    }
    console.log('state', state)
};

export const setLocalStream = (stream) =>{
    state = {
        ...state,
        localStream: stream
    }
};

export const setAllowConnectionsFromStrangers = (allowConnection) =>{
    state ={
        ...state,
        allowConnectionsFromsStrangers: allowConnection
    }
};

export const setScreenSharingActive = (screenSharingActive) =>{
    state ={
        ...state,
        screenSharingActive
    }   
};

export const setScreenSharingStream = (stream) =>{
    state={
        ...state,
        screenSharingStream: stream
    }
}

export const setRemoteStream = (stream)=>{
    state={
        ...state,
        remoteStream: stream
    }
}

export const getState = ()=>{
    return state;
}




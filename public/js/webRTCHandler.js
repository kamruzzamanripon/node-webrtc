 import * as constants from './constants.js';
import * as ui from './ui.js';
import * as wss from './wss.js';

 let connectedUserDetails;

 export const sendPreOffer = (callType, calleePersonalCode)=>{
    //console.log("pre offer fun ex ")
    const data = {
      callType,
      calleePersonalCode
    }
    console.log('wbRTCHandler.js', data)
    wss.sendPreOffer(data);
 }

export const handlePreOffer = (data)=>{
   const {callType, callerSocketId} = data;

   connectedUserDetails ={
      socketId: callerSocketId,
      callType
   }

   if( callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE){
      ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler)
   }
}

const acceptCallHandler = ()=>{
   console.log("call accepted");
}

const rejectCallHandler = ()=>{
   console.log("call rejected")
}



  
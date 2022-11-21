 import * as constants from './constants.js';
import * as store from './store.js';
import * as ui from './ui.js';
import * as wss from './wss.js';

 let connectedUserDetails;
 let peerConnection;
 let screenSharingStream;
 let dataChannel;
 const defaultConstraints = {
   audio: true,
   video: true
 }
 const configuration = {
   iceServers:[
      {
         urls: 'stun:stun.1.google.com:13902'
      }
   ]
 }

 export const getLocalPreview = ()=>{
   navigator.mediaDevices.getUserMedia(defaultConstraints)
         .then((stream)=>{
            ui.updateLocalVideo(stream);
            ui.showVideoCallButtons();
            store.setCallState(constants.callState.CALL_AVAILABLE)
            store.setLocalStream(stream);
         })
 }

 const createPeerConnection = ()=>{
   peerConnection = new RTCPeerConnection(configuration);

   //For Chat
   dataChannel = peerConnection.createDataChannel('chat');
   peerConnection.ondatachannel = (event)=>{
      const dataChannel = event.channel;

      dataChannel.onopen = ()=>{
         console.log("peer connection is ready to receive data channel message");
      }

      dataChannel.onmessage = (event) =>{
         console.log("message came from  message")
         const message = JSON.parse(event.data);
         ui.appendMessage(message);
         console.log(message)
      }
   }

   peerConnection.onicecandidate = (event)=>{
      console.log("geeting ice candidates from stun server");
      if(event.candidate){
         //sent our ice candidates to other peer
         wss.sendDataUsingWebRTCSignaling({
            connectedUserSocketId: connectedUserDetails.socketId,
            type: constants.webRTCSingnaling.ICE_CANDIDATE,
            candidate: event.candidate
         })
      }
   }

   peerConnection.onconnectionstatechange = (event)=>{
      if(peerConnection.connectionState === 'connected'){
         console.log("successfully connected with other peer")
      }
   }

   //Receiving Tracks
   const remoteStream = new MediaStream();
   store.setRemoteStream(remoteStream);
   ui.updateRemoteVideo(remoteStream);

   peerConnection.ontrack = (event)=>{
      remoteStream.addTrack(event.track);
   }

   //add our stream to peer connection
   if(connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE){
      const localStream = store.getState().localStream;
      
      for(const track of localStream.getTracks()){
         peerConnection.addTrack(track, localStream);
      }
   }
 }


  //Chat 
  export const sendMessageUsingDataChannel = (message)=>{
   const stringifiedMessage = JSON.stringify(message);
   dataChannel.send(stringifiedMessage);
  }

  
 export const sendPreOffer = (callType, calleePersonalCode)=>{
    //console.log("pre offer fun ex ")
    connectedUserDetails = {
      callType,
      socketId:calleePersonalCode
   }
    
   if(callType === constants.callType.CHAT_PERSONAL_CODE || constants.callType.VIDEO_PERSONAL_CODE){
      const data = {
         callType,
         calleePersonalCode
       }
       //console.log('wbRTCHandler.js', data)
       ui.showCallingDialog(callingDialogRejectCallHandler);
       store.setCallState(constants.callState.CALL_UNAVAILABLE);
       wss.sendPreOffer(data);
   }
 }

export const handlePreOffer = (data)=>{
   const {callType, callerSocketId} = data;
   
   if(!checkCallPossibility()){
      return sendPreOfferAnswer(constants.preOfferAnswer.CALL_UNAVAILABLE, callerSocketId)
   }

   connectedUserDetails ={
      socketId: callerSocketId, //1st person
      callType
   }

   store.setCallState(constants.callState.CALL_UNAVAILABLE);
   
   //console.log('connectedUserDetails', connectedUserDetails)
   if( callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE){
      ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler)
   }
}

const acceptCallHandler = ()=>{
   console.log("callee call accepted");
   createPeerConnection();
   sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
   ui.showCallElements(connectedUserDetails.callType)
}

const rejectCallHandler = ()=>{
   console.log("call rejected")
   sendPreOfferAnswer();
   setIncomingCallsAvailable();
   sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
}

const callingDialogRejectCallHandler = ()=>{
   //console.log("rejectiong the call")
   const data = { connectedUserSocketId: connectedUserDetails.socketId}
   closePeerConnectionAndResetState();
   wss.sendUserHangedUp(data);
}

const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) =>{
   const socketId = callerSocketId ? callerSocketId : connectedUserDetails.socketId;   
   const data = {
      callerSocketId: socketId,
      preOfferAnswer
   }

   ui.removeAllDialogs();
   wss.sendPreOfferAnswer(data)
}

export const handlePreOfferAnswer = (data) =>{
   const {preOfferAnswer} = data;
   ui.removeAllDialogs();

   if(preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND){
      ui.showInfoDialog(preOfferAnswer);
      setIncomingCallsAvailable();
      //show dialog that callee has not been found
   }

   if(preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE){
      ui.showInfoDialog(preOfferAnswer);
      setIncomingCallsAvailable();
      //show dialog that callee is not able to connect
   }

   if(preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED){
      ui.showInfoDialog(preOfferAnswer);
      setIncomingCallsAvailable();
      //show dialog that callee is rejected by the callee
   }

   if(preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED){
      //show dialog that callee has accepted
      ui.showCallElements(connectedUserDetails.callType)
      createPeerConnection();
      sendWebRTCOffer();
   }
}

//caller [1st user] send webrtc offer to callee
const sendWebRTCOffer = async()=>{
   const offer = await peerConnection.createOffer() //1st user SDP and create offer
   await peerConnection.setLocalDescription(offer); //1st user offer store
   wss.sendDataUsingWebRTCSignaling({
      connectedUserSocketId: connectedUserDetails.socketId,
      type: constants.webRTCSingnaling.OFFER,
      offer: offer
   })
}

// callee [2nd user] accepct webrtc offer and handle this
export const handleWebRTCOffer = async (data)=>{
   await peerConnection.setRemoteDescription(data.offer); //1st user answer store
   const answer = await peerConnection.createAnswer();
   await peerConnection.setLocalDescription(answer); //2nd user create answer and store
   wss.sendDataUsingWebRTCSignaling({
      connectedUserSocketId: connectedUserDetails.socketId,
      type: constants.webRTCSingnaling.ANSWER,
      answer: answer
   })
}

//caller handle answer offer
export const handleWebRTCAnswer = async (data) =>{
   console.log("handling web answer test")
   await peerConnection.setRemoteDescription(data.answer);
}

export const handleWebRTCCandidate = async (data)=>{
   try{
      await peerConnection.addIceCandidate(data.candidate);
   }catch(err){
      console.error("error occured when trying to add received ice candiate", err)
   }
}


//Share screen.
export const switchBetweenCameraAndScreenSharing = async (
   screenSharingActive
 ) => {
   if (screenSharingActive) {
     const localStream = store.getState().localStream;
     const senders = peerConnection.getSenders();
 
     const sender = senders.find((sender) => {
       return sender.track.kind === localStream.getVideoTracks()[0].kind;
     });
 
     if (sender) {
       sender.replaceTrack(localStream.getVideoTracks()[0]);
     }
 
     // stop screen sharing stream
      store
       .getState()
       .screenSharingStream.getTracks()
       .forEach((track) => track.stop());
 
     store.setScreenSharingActive(!screenSharingActive);
 
     ui.updateLocalVideo(localStream);
   } else {
     console.log("switching for screen sharing");
     try {
       screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
         video: true,
       });
       store.setScreenSharingStream(screenSharingStream);
 
       // replace track which sender is sending
       const senders = peerConnection.getSenders();
 
       const sender = senders.find((sender) => sender.track.kind === screenSharingStream.getVideoTracks()[0].kind );
 
       if (sender) {
         sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
       }
 
       store.setScreenSharingActive(!screenSharingActive);
 
       ui.updateLocalVideo(screenSharingStream);
     } catch (err) {
       console.error(
         "error occured when trying to get screen sharing stream",
         err
       );
     }
   }
 };

 //hand up
 export const handleHangUp = ()=>{
      console.log("finished the call hang up")
      const data = {connectedUserSocketId: connectedUserDetails.socketId}

      wss.sendUserHangedUp(data);
      closePeerConnectionAndResetState()
 }

 export const handleConnectedUserHangedUp = ()=>{
   console.log("hangup connected peer hang up")
   closePeerConnectionAndResetState()
 }

 const closePeerConnectionAndResetState = ()=>{
   if(peerConnection){
      peerConnection.close();
      peerConnection = null;
   }

   //active mic and camera
   if( connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE || connectedUserDetails.callType === constants.callType.VIDEO_STRANGER){
      store.getState().localStream.getVideoTracks()[0].enabled = true;
      store.getState().localStream.getAudioTracks()[0].enabled = true;
   }

   ui.updateUiAfterHangUp(connectedUserDetails.callType);
      setIncomingCallsAvailable();
      connectedUserDetails = null;
 }
 

 const setIncomingCallsAvailable = () =>{
   const localStream = store.getState().localStream;
   if(localStream){
      store.setCallState(constants.callState.CALL_AVAILABLE);
   }else {
      store.setCallState(constants.callState.CALL_AVAILABLE_ONLY_CHAT);
   }
 }

 //check other caller who is busy on not
 const checkCallPossibility = (callType)=>{
   const callState = store.getState().callState;
   
   if(callState === constants.callState.CALL_AVAILABLE){
       return true;
   }

   if( (callType === constants.callType.VIDEO_PERSONAL_CODE || callType === constants.callType.VIDEO_STRANGER) && callState === constants.callState.CALL_AVAILABLE_ONLY_CHAT ){
       return false;
   }

   return false;
}






  
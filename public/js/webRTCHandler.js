 import * as wss from './wss.js';
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
   console.log("handlePreOffer offer came");
   console.log(data);
}

  
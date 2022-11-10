import * as store from './store.js';
import * as ui from './ui.js';

export const registerSocketEvents = (socket) =>{
    socket.on("connect", () => {
        //console.log("succesfully connected to socket.io server");
        //console.log("info", socket);
        console.log(socket.id);
        store.setSocketId(socket.id);
        ui.updatePersonalCode(socket.id);
      });
      
}




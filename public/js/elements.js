
export const getIncomingCallDialog = (callTypeInfo, acceptCallHandler, rejectCallHandler) =>{
    console.log("getting incoming call dialog")

    //total background wich is blur
    const dialog = document.createElement("div");
    dialog.classList.add("dialog_wrapper");
    //backgounder under sub-div which show all infomartion
    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent)

    //title
    const title = document.createElement("p");
    title.classList.add("dialog_title");
    title.innerHTML = `Incoming ${callTypeInfo} Call`;

    //image
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("dialog_image_container");
    const image = document.createElement("img");
    const avaterImagePath = "./utils/images/dialogAvatar.png";
    image.src = avaterImagePath;
    imageContainer.appendChild(image); 

    //button container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("dialog_button_container");
    //button one
    const acceptCallButton = document.createElement("button");
    acceptCallButton.classList.add("dialog_accept_call_button");
    const acceptCallImg = document.createElement("img");
    acceptCallImg.classList.add("dialog_button_image");
    const acceptCallImgPath = "./utils/images/acceptCall.png";
    acceptCallImg.src = acceptCallImgPath;
    acceptCallButton.append(acceptCallImg)
    buttonContainer.appendChild(acceptCallButton);
    //button Two
    const rejectCallButton = document.createElement("button");
    rejectCallButton.classList.add("dialog_reject_call_button");
    const rejectCallImg = document.createElement("img");
    rejectCallImg.classList.add("dialog_button_image");
    const rejectCallImgPath = "./utils/images/rejectCall.png";
    rejectCallImg.src = rejectCallImgPath;
    rejectCallButton.append(rejectCallImg)
    buttonContainer.appendChild(rejectCallButton);



    dialogContent.appendChild(title);
    dialogContent.appendChild(imageContainer);
    dialogContent.appendChild(buttonContainer);

    // const dialogHTML = document.getElementById("dialog");
    // dialogHTML.append(dialog)

    acceptCallButton.addEventListener("click", ()=>{
        acceptCallHandler();
    })
    rejectCallButton.addEventListener("click", ()=>{
        rejectCallHandler();
    })

    return dialog;
} 

export const getCallingDialog = (rejectCallHandler)=>{
    //total background wich is blur
    const dialog = document.createElement("div");
    dialog.classList.add("dialog_wrapper");
    //backgounder under sub-div which show all infomartion
    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent)

    //title
    const title = document.createElement("p");
    title.classList.add("dialog_title");
    title.innerHTML = `Calling`;

    //image
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("dialog_image_container");
    const image = document.createElement("img");
    const avaterImagePath = "./utils/images/dialogAvatar.png";
    image.src = avaterImagePath;
    imageContainer.appendChild(image); 

    //button container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("dialog_button_container");
    //button one
    const hangUpCallButton = document.createElement("button");
    hangUpCallButton.classList.add("dialog_reject_call_button");
    const hangUpCallImg = document.createElement("img");
    hangUpCallImg.classList.add("dialog_button_image");
    const hangUpCallImgPath = "./utils/images/rejectCall.png";
    hangUpCallImg.src = hangUpCallImgPath;
    hangUpCallButton.append(hangUpCallImg)
    buttonContainer.appendChild(hangUpCallButton);


    dialogContent.appendChild(title);
    dialogContent.appendChild(imageContainer);
    dialogContent.appendChild(buttonContainer);
    
    return dialog;
}

export const getInfoDialog = (dialogTitle, dialogDescription)=>{
    //total background wich is blur
    const dialog = document.createElement("div");
    dialog.classList.add("dialog_wrapper");
    //backgounder under sub-div which show all infomartion
    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog_content");
    dialog.appendChild(dialogContent)

    //title
    const title = document.createElement("p");
    title.classList.add("dialog_title");
    title.innerHTML = dialogTitle;

    //image
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("dialog_image_container");
    const image = document.createElement("img");
    const avaterImagePath = "./utils/images/dialogAvatar.png";
    image.src = avaterImagePath;
    imageContainer.appendChild(image); 

    const description = document.createElement('p');
    description.classList.add("dialog_description");
    description.innerHTML = dialogDescription;

    dialogContent.appendChild(title);
    dialogContent.appendChild(imageContainer);
    dialogContent.appendChild(description);
    
    return dialog;
}
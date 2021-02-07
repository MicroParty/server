const socket = io('/');
const vidContainer = document.getElementsByClassName("vid-container")[0];
const thePeer = new Peer(undefined,{
    host: '/',
    port: '3001'
});

const myVid = document.createElement('video');
myVid.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {


    addStream(myVid, stream)

    thePeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on('stream', usrStream => {
            addStream(video, usrStream);
        })
    })

    socket.on('user-connected', userId => {
        connectToUsr(userId, stream)
    })

    socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId);
    })
})


thePeer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
})

function connectToUsr(userId, stream){
    const call = thePeer.call(userId, stream);
    const video = document.createElement("video");
    call.on('stream', usrStream =>{
        addStream(video, usrStream)
    })
    call.on('close', () => {
        video.remove();
    })
}


socket.on('user-connected', userId =>{
    console.log(userId + " joined the call");

})
    

function addStream(vid, stream){
    vid.srcObject = stream;
    vid.addEventListener('loadedmetadata', () =>{
        vid.play();
    })
    vidContainer.appendChild(vid);
}
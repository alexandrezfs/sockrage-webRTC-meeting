/**
 * @type {{sockrage_addr: string, db: {chat: string, user: string, room: string}, server_port: number}}
 */
exports.configObject = {
    sockrage_addr : "http://localhost:3000",
    db : {
        chat : "sockrage_meeting_chat",
        user : "sockrage_meeting_user",
        room : "sockrage_meeting_room"
    },
    server_port : 3003
};
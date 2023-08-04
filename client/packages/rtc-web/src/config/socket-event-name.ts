export const enum SocketEventName {
  Count = 'count',
  CreateAndJoin = 'createAndJoin',
  RoomCreated = 'created',
  RoomExit = 'exit',
  RoomJoin = 'joined',
  RoomOffer = 'offer',
  RoomAnswer = 'answer',
  RoomCandidate = 'candidate',
}

// chat 的事件名
export const enum ChatEventName {
  ChatingRoom = 'chatingRoom',
}

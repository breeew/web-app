export enum EventType {
    EVENT_UNKNOWN = 0,
    EVENT_ASSISTANT_INIT = 1,
    /** EVENT_ASSISTANT_CONTINUE - match StreamMessage */
    EVENT_ASSISTANT_CONTINUE = 2,
    EVENT_ASSISTANT_DONE = 3,
    EVENT_ASSISTANT_FAILED = 4,
    /** EVENT_MESSAGE_PUBLISH - match MessageDetail */
    EVENT_MESSAGE_PUBLISH = 100,
    /** EVENT_MESSAGE_ACK - match SendMessageReply */
    EVENT_MESSAGE_ACK = 101,
    EVENT_SYSTEM_ONSUBSCRIBE = 300,
    UNRECOGNIZED = -1
}

import { proxy } from 'valtio';

const sessionStore = proxy<SessionStore>({
    currentSelectedSession: undefined,
    sessionNamedEvent: undefined
});

export const setCurrentSelectedSession = (data: Session) => {
    sessionStore.currentSelectedSession = data;
};

export const notifySessionNamedEvent = (data: SessionNamedEvent) => {
    sessionStore.sessionNamedEvent = data;
};

export default sessionStore;

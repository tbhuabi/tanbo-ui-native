export enum EventType {
    Enter,
    Leave
}

export interface Event {
    type: EventType;
    component: any;
}
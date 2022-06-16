import { Status } from "grpc-web";
import { GrpcMessage } from "./grpc-message";
import { GrpcDataEvent } from "./grpc-data-event";

export class GrpcStatusEvent implements Status {
    constructor(
        public code: number,
        public details: string,
        public metadata: { [prop: string]: string }) {
    }
}

export type GrpcEvent<T extends GrpcMessage<TMessage>, TMessage = unknown> =
    GrpcDataEvent<T, TMessage>
    | GrpcStatusEvent;

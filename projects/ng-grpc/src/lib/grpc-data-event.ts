import { GrpcMessage } from "./grpc-message";

export class GrpcDataEvent<T extends GrpcMessage<TMessage>, TMessage = unknown> {
    constructor(public data: T) {
    }
}

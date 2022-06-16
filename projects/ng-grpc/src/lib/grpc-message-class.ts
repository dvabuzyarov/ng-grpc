import { ByteSource } from "google-protobuf";
import { GrpcMessage } from "./grpc-message";
import { RecursivePartial } from "./recursive-partial";

export interface GrpcMessageClass<M extends GrpcMessage<TMessage>, TMessage = unknown> {
    fromBinary: (bytes: ByteSource) => M;
    toBinary: (instance: M) => ByteSource;

    new(m?: RecursivePartial<M>): M;
}

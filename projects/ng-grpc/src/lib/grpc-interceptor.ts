import { Observable } from "rxjs";
import { GrpcHandler } from "./grpc-handler";
import { GrpcMessage } from "./grpc-message";
import { GrpcRequest } from "./grpc-client";
import { GrpcEvent } from "./grpc-event";

export interface GrpcInterceptor {
    intercept<Q extends GrpcMessage<QMessage>,
        S extends GrpcMessage<SMessage>,
        QMessage = unknown,
        SMessage = unknown>(request: GrpcRequest<Q, S>, next: GrpcHandler): Observable<GrpcEvent<S>>;
}

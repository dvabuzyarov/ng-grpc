import { Observable, of, throwError } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { GrpcMessage } from "./grpc-message";
import { GrpcEvent, GrpcStatusEvent } from "./grpc-event";
import { GrpcDataEvent } from "./grpc-data-event";

/**
 * RxJS operator
 * When applied to gRPC events emits error for status events with a non-zero code (includes throwStatusErrors)
 *
 * @return Observable of gRPC events
 */
export function throwStatusErrors<T extends GrpcMessage<TMessage>, TMessage>() {
    return (source$: Observable<GrpcEvent<T, TMessage>>) => source$.pipe(
        switchMap(event => event instanceof GrpcStatusEvent && event.code ? throwError(event) : of(event)),
    );
}

/**
 * RxJS operator
 * When applied to gRPC events stream emits only messages
 *
 * @return Observable of messages
 */
export function takeMessages<T extends GrpcMessage<TMessage>, TMessage>() {
    return (source$: Observable<GrpcEvent<T, TMessage>>) => source$.pipe(
        filter(event => event instanceof GrpcDataEvent),
        map((event: GrpcDataEvent<T, TMessage>) => event.data),
    );
}

/**
 * RxJS operator
 * When applied to gRPC events stream emits only messages toJSON objects
 *
 * @return Observable of messages
 */
export function takeMessagesJSON<T extends GrpcMessage<TMessage>, TMessage>() {
    return (source$: Observable<GrpcEvent<T, TMessage>>) => source$.pipe(
        filter(event => event instanceof GrpcDataEvent),
        map((event: GrpcDataEvent<T, TMessage>) => event.data.toJSON()),
    );
}

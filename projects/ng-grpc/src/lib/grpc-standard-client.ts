import { Injectable } from "@angular/core";
import { AbstractClientBase, GrpcWebClientBase, Metadata } from "grpc-web";
import { Observable } from "rxjs";
import { GrpcClient, GrpcClientFactory, GrpcClientSettings } from "./grpc-client";
import { GrpcMessage } from "./grpc-message";
import { GrpcMessageClass } from "./grpc-message-class";
import { GrpcDataEvent, GrpcEvent, GrpcStatusEvent } from "./grpc-event";

@Injectable({
    providedIn: "root"
})
export class GrpcStandardClientFactory implements GrpcClientFactory {

    createClient(serviceId: string, settings: GrpcClientSettings) {
        return new GrpcStandardClient({...settings});
    }

}

export class GrpcStandardClient implements GrpcClient {

    private client: GrpcWebClientBase;

    constructor(
        private settings: GrpcClientSettings,
    ) {
        this.client = new GrpcWebClientBase(this.settings);
    }

    unary<Q extends GrpcMessage<ReqMessage>, S extends GrpcMessage<ResMessage>, ReqMessage = unknown, ResMessage = unknown>(
        path: string,
        req: Q,
        metadata: Metadata,
        reqclss: GrpcMessageClass<Q>,
        resclss: GrpcMessageClass<S>,
    ): Observable<GrpcEvent<S>> {
        return new Observable(obs => {
            const stream = this.client.rpcCall<Q, S>(
                this.settings.host + path,
                req,
                metadata || {},
                // todo: It takes MethodDescriptor, but the source code accepts either MethodInfo or MethodDescriptor.
                // https://github.com/grpc/grpc-web/issues/981
                new AbstractClientBase.MethodInfo(
                    resclss,
                    (request: Q) => reqclss.toBinary(request),
                    resclss.fromBinary
                ) as any,
                () => null
            );

            // take only status 0 because unary error already includes non-zero statuses
            stream.on("status", status => status.code === 0 ?
                obs.next(new GrpcStatusEvent(status.code, status.details, status.metadata))
                : null);
            stream.on("error", error => {
                obs.next(new GrpcStatusEvent(error.code, error.message, (error as any).metadata));
                obs.complete();
            });
            stream.on("data", data => obs.next(new GrpcDataEvent(data)));
            stream.on("end", () => obs.complete());

            return () => stream.cancel();
        });
    }

    serverStream<Q extends GrpcMessage<QMessage>, S extends GrpcMessage<SMessage>, QMessage = unknown, SMessage = unknown>(
        path: string,
        req: Q,
        metadata: Metadata,
        reqclss: GrpcMessageClass<Q>,
        resclss: GrpcMessageClass<S>
    ): Observable<GrpcEvent<S>> {
        return new Observable(obs => {
            const stream = this.client.serverStreaming(
                this.settings.host + path,
                req,
                metadata || {},
                // todo: It takes MethodDescriptor, but the source code accepts either MethodInfo or MethodDescriptor.
                //  https://github.com/grpc/grpc-web/issues/981
                new AbstractClientBase.MethodInfo(
                    resclss,
                    (request: Q) => reqclss.toBinary(request),
                    resclss.fromBinary) as any
            );

            stream.on("status", status => obs.next(new GrpcStatusEvent(status.code, status.details, status.metadata)));
            stream.on("error", error => {
                obs.next(new GrpcStatusEvent(error.code, error.message, (error as any).metadata));
                obs.complete();
            });
            //  https://github.com/grpc/grpc-web/issues/981 new GrpcDataEvent(data)
            stream.on("data", data => obs.next(new GrpcDataEvent(data as any)));
            stream.on("end", () => obs.complete());

            return () => stream.cancel();
        });
    }

}

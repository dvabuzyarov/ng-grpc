import { Injectable } from "@angular/core";
import { GrpcClientFactory, GrpcClientSettings } from "./grpc-client";
import { GrpcStandardClient } from "./grpc-standard-client";

@Injectable({
    providedIn: "root"
})
export class GrpcStandardClientFactory implements GrpcClientFactory {

    createClient(serviceId: string, settings: GrpcClientSettings) {
        return new GrpcStandardClient({...settings});
    }
}

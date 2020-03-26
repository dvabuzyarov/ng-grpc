import { InjectionToken } from "@angular/core";
import { GrpcClientSettings } from "./grpc-client";

export const GRPC_CLIENT_FACTORY = new InjectionToken("GRPC_CLIENT_FACTORY");
export const GRPC_INTERCEPTORS = new InjectionToken("GRPC_INTERCEPTORS");
export const GRPC_SERVICE_DEFAULT_SETTINGS = new InjectionToken<GrpcClientSettings>("GRPC_SERVICE_DEFAULT_SETTINGS");

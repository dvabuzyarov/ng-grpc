import { InjectionToken } from "@angular/core";

export interface GrpcClientSettings {
    host: string;
    format?: string;
    suppressCorsPreflight?: boolean;
}

export const GRPC_SERVICE_DEFAULT_SETTINGS = new InjectionToken<GrpcClientSettings>("GRPC_SERVICE_DEFAULT_SETTINGS");

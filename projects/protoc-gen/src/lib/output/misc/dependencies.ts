export class Dependency {

    constructor(
        public from: string,
        public token: string,
    ) {
    }

}

const angularCore = {
    Inject: new Dependency("@angular/core", "Inject"),
    Optional: new Dependency("@angular/core", "Optional"),
    Injectable: new Dependency("@angular/core", "Injectable"),
    InjectionToken: new Dependency("@angular/core", "InjectionToken"),
};

const ngxGrpcCommon = {
    GrpcCallType: new Dependency("@ng-grpc/core", "GrpcCallType"),
    GrpcClient: new Dependency("@ng-grpc/core", "GrpcClient"),
    GrpcClientFactory: new Dependency("@ng-grpc/core", "GrpcClientFactory"),
    GrpcClientSettings: new Dependency("@ng-grpc/core", "GrpcClientSettings"),
    GrpcClientDefaultSettings: new Dependency("@ng-grpc/core", "GRPC_SERVICE_DEFAULT_SETTINGS"),
    GrpcMessage: new Dependency("@ng-grpc/core", "GrpcMessage"),
    RecursivePartial: new Dependency("@ng-grpc/core", "RecursivePartial"),
    GrpcEvent: new Dependency("@ng-grpc/core", "GrpcEvent"),
};

const ngxGrpcCore = {
    GrpcHandler: new Dependency("@ng-grpc/core", "GrpcHandler"),
    takeMessages: new Dependency("@ng-grpc/core", "takeMessages"),
    throwStatusErrors: new Dependency("@ng-grpc/core", "throwStatusErrors"),
    GRPC_CLIENT_FACTORY: new Dependency("@ng-grpc/core", "GRPC_CLIENT_FACTORY"),
};

const ngxGrpcWorker = {
    GrpcWorkerServiceClientDef: new Dependency("@ngx-grpc/worker", "GrpcWorkerServiceClientDef"),
};

const googleProtobuf = {
    BinaryReader: new Dependency("google-protobuf", "BinaryReader"),
    BinaryWriter: new Dependency("google-protobuf", "BinaryWriter"),
    ByteSource: new Dependency("google-protobuf", "ByteSource"),
};

const grpcWeb = {
    Metadata: new Dependency("grpc-web", "Metadata"),
    Status: new Dependency("grpc-web", "Status"),
    GrpcWebClientBase: new Dependency("grpc-web", "GrpcWebClientBase"),
};

const rxjs = {
    Observable: new Dependency("rxjs", "Observable"),
};

export const ExternalDependencies = {
    ...angularCore,
    ...googleProtobuf,
    ...grpcWeb,
    ...ngxGrpcCore,
    ...ngxGrpcCommon,
    // ...ngxGrpcWorker,
    ...rxjs,
};

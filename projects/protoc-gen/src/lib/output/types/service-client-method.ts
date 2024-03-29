import { Proto } from "../../input/proto";
import { ProtoService } from "../../input/proto-service";
import { ServiceMethod } from "../../input/proto-service-method";
import { camelizeSafe } from "../../utils";
import { ExternalDependencies } from "../misc/dependencies";
import { Printer } from "../misc/printer";
import { JSDoc } from "./js-doc";

export class ServiceClientMethod {

    constructor(
        private proto: Proto,
        private service: ProtoService,
        private serviceMethod: ServiceMethod,
    ) {
    }

    print(printer: Printer) {
        printer.addDeps(
            ExternalDependencies.GrpcCallType,
            ExternalDependencies.GrpcEvent,
            ExternalDependencies.Metadata,
            ExternalDependencies.Observable,
        );

        const serviceUrlPrefix = this.proto.pb_package ? `${this.proto.pb_package  }.` : "";
        const inputType = this.proto.getRelativeTypeName(this.serviceMethod.inputType, "thisProto");
        const outputType = this.proto.getRelativeTypeName(this.serviceMethod.outputType, "thisProto");
        const messageOutputType = this.getInterfaceNotation(this.proto.getRelativeTypeName(this.serviceMethod.outputType, "thisProto"));

        const jsdocMessagesOnly = new JSDoc();

        const streamingMethod = this.serviceMethod.serverStreaming ? "Server streaming" : "Unary";
        jsdocMessagesOnly.setDescription(`${streamingMethod} RPC. Emits messages and throws errors on non-zero status codes`);
        jsdocMessagesOnly.addParam({type: inputType, name: "request", description: "Request message"});
        jsdocMessagesOnly.addParam({type: "Metadata", name: "metadata", description: "Additional data"});
        jsdocMessagesOnly.setReturn(`Observable<${messageOutputType}>`);
        jsdocMessagesOnly.setDeprecation(!!this.serviceMethod.options && this.serviceMethod.options.deprecated);

        const jsdocEvents = new JSDoc();

        jsdocEvents.setDescription(`${streamingMethod} RPC. Emits data and status events; does not throw errors by design`);
        jsdocEvents.addParam({type: inputType, name: "request", description: "Request message"});
        jsdocEvents.addParam({type: "Metadata", name: "metadata", description: "Additional data"});
        jsdocEvents.setReturn(`Observable<GrpcEvent<${outputType}>>`);
        jsdocEvents.setDeprecation(!!this.serviceMethod.options && this.serviceMethod.options.deprecated);

        const returnType = `Observable<${messageOutputType}>`;
        const eventReturnType = `Observable<GrpcEvent<${outputType}>|${messageOutputType}>`;
        printer.add(`
      ${jsdocMessagesOnly.toString()}
      ${camelizeSafe(this.serviceMethod.name)}(requestData: ${inputType}, requestMetadata: Metadata = {}): ${returnType} {
        return this.${camelizeSafe(this.serviceMethod.name)}$eventStream(requestData, requestMetadata) as any;
      }

      ${jsdocEvents.toString()}
      ${camelizeSafe(this.serviceMethod.name)}$eventStream(requestData: ${inputType}, requestMetadata: Metadata = {}): ${eventReturnType} {
        return this.handler.handle({
          type: GrpcCallType.${this.serviceMethod.serverStreaming ? "serverStream" : "unary"},
          client: this.client,
          path: '/${serviceUrlPrefix}${this.service.name}/${this.serviceMethod.name}',
          requestData,
          requestMetadata,
          requestClass: ${inputType},
          responseClass: ${outputType},
        });
      }
    `);
    }

    private getInterfaceNotation(typeName: string) {
        const lastDotIndex = typeName.lastIndexOf(".");
        if (lastDotIndex > -1) {
            return `${typeName.slice(0, lastDotIndex + 1)}I${typeName.slice(lastDotIndex + 1)}`;
        }
        return `I${typeName}`;
    }
}

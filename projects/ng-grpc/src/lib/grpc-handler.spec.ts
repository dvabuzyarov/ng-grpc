import { GrpcHandler } from "./grpc-handler";
import { createMoqInjector } from "./createMoqInjector";

describe("GRPC handler", () => {

    beforeEach(() => {
        createMoqInjector(GrpcHandler);
    });

    it("Returns provided value", () => {
        expect(true).toBe(true);
    });
});

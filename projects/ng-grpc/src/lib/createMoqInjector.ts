import { InjectionToken, Injector, StaticProvider, Type } from "@angular/core";
import { IMock, Mock } from "moq.ts";
import { IMockedObject, IOptions, IParameter, MockFactory, moqInjectorProviders, resolveMock } from "ng-auto-moq";

export let injector: Injector;
export let testedToken: Type<any>;

export interface IMoqInjectorOptions<T> extends IOptions<T> {
    providers?: StaticProvider[];
}

export function createMoqInjector<T>(constructor: Type<T>, options: IMoqInjectorOptions<T> = {}): Injector {
    testedToken = constructor;
    options.mockFactory = options.mockFactory ? options.mockFactory : moqFactory;
    const customProvider = options.providers ? options.providers : [];
    const providers = [...moqInjectorProviders(constructor, options), ...customProvider];
    injector = Injector.create({providers});
    return injector;
}

export function resolve<T>(token: Type<T> | InjectionToken<T>): IMock<T> {
    return resolveMock<T>(token, injector);
}

export function get<T>(token: Type<T> | InjectionToken<T> = testedToken): T {
    return injector.get(token);
}

function moqFactory(parameter: IParameter, defaultMockFactory: MockFactory): IMock<any & IMockedObject<any>> {
    const mock = mockFactory(parameter);
    mock.setup(instance => instance.__mock).returns(mock);
    return mock;
}

function mockFactory(parameter: IParameter) {
    if (typeof parameter.token === "function") {
        return new Mock<any & IMockedObject<any>>({name: parameter.displayName, target: {}})
            .prototypeof(parameter.token.prototype);
    }

    return new Mock<any & IMockedObject<any>>({name: parameter.displayName});
}

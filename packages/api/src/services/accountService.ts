import { implementEndpoints, IService } from "../common/generics";

export interface IAccountService extends IService {
    createAccount: {
        payload: { hashedPassword: string; email: string; name: string; username: string };
        response: string;
    };
    loginToAccount: {
        payload: { hashedPassword: string; username: string };
        response: string;
    };
}

const { backend, frontend } = implementEndpoints<IAccountService>({
    createAccount: {
        method: "post",
        slug: "/account/create",
    },
    loginToAccount: {
        method: "post",
        slug: "/account/login",
    },
});

export const AccountServiceBackend = backend;
export const AccountServiceFrontend = frontend;

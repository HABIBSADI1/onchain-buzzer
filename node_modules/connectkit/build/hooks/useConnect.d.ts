/**
 * This is a wrapper around wagmi's useConnect hook that adds some
 * additional functionality.
 */
export declare function useConnect({ ...props }?: {}): {
    data: import("@wagmi/core").ConnectResult<import("@wagmi/core/dist/index-35b6525c").P> | undefined;
    error: Error | null;
    isError: boolean;
    isIdle: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    pendingConnector: import("@wagmi/connectors/dist/base-84a689bb").C<any, any, any> | undefined;
    reset: () => void;
    status: "error" | "success" | "loading" | "idle";
    variables: import("@wagmi/core").ConnectArgs | undefined;
    connect: ({ ...opts }: {
        [x: string]: any;
    }) => void;
    connectAsync: ({ ...opts }: {
        [x: string]: any;
    }) => Promise<import("@wagmi/core").ConnectResult<import("@wagmi/core/dist/index-35b6525c").P>>;
    connectors: import("@wagmi/connectors/dist/base-84a689bb").C<any, any, any>[];
};

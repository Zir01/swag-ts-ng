declare module _ {
    interface LoDashStatic {
        filter<T>(
            collection: Collection<T>,
            pluckValue: string,
            criteria: boolean): T[];
    }
}
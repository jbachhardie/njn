export declare function drive<T, R>(iter: Iterator<T>, driver: (action: T) => R): Promise<R | undefined>;

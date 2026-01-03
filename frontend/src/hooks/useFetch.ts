import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions {
    immediate?: boolean;
}

interface UseFetchReturn<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const useFetch = <T>(
    fetchFn: () => Promise<T>,
    options: UseFetchOptions = { immediate: true }
): UseFetchReturn<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const executeFetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchFn]);

    useEffect(() => {
        if (options.immediate) {
            executeFetch();
        }
    }, [executeFetch, options.immediate]);

    return {
        data,
        loading,
        error,
        refetch: executeFetch,
    };
};

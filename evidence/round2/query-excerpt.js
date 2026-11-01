function useQuery(fn, deps, options, normalizeFailure) {
    const client = useSomniaMarketsClient(options.chainId);
    const [state, setState] = useState({
        data: undefined,
        loading: true,
        error: null,
    });
    const controller = useRef(null);
    const run = useCallback(() => {
        controller.current?.abort();
        const ctrl = new AbortController();
        controller.current = ctrl;
        setState((s) => ({ ...s, loading: true, error: null }));
        // `ctrl.signal.aborted` doubles as the staleness fence: a run is superseded
        // (dep change, refetch, unmount) exactly when its controller was aborted,
        // even for an `fn` that ignores the signal — the check is on our side.
        fn(client, ctrl.signal).then((data) => {
            if (!ctrl.signal.aborted)
                setState({ data, loading: false, error: null });
        }, (e) => {
            if (!ctrl.signal.aborted) {
                setState((s) => ({ ...s, loading: false, error: normalizeFailure(e) }));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- caller owns `deps`; `fn` is keyed by them
    }, [client, ...deps]);
    useEffect(() => {
        run();
        return () => {
            // Abort the in-flight request of a torn-down instance; this also fences
            // its response out of state.
            controller.current?.abort();
        };
    }, [run]);
    return { ...state, refetch: run };
}

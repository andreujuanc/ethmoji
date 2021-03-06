import { useRef, useEffect, useCallback, useState } from 'react';
import './input.scss'

export function Input(props: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type: "text" | "number",
    readonly?: boolean
}) {
    const [value, setValue] = useState(props.value)

    const debounce = useDebounce((newValue: string) => {
        // setValue(newValue)
        props.onChange(newValue)
    }, 1000)

    useEffect(() => {
        if (props.value !== value)
            setValue(props.value)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.value])

    return <input className={'input'}
        readOnly={props.readonly}
        value={value}
        type={props.type}
        onChange={(e) => {

            setValue(e.target.value)
            debounce(e.target.value)
            //props.onChange(e.target.value)
            //e.preventDefault();
        }} placeholder={props.placeholder} />;
}



const useDebounce = <F extends (...args: any) => any>(
    func: F,
    waitFor: number,
): ((...args: Parameters<F>) => ReturnType<F>) => {
    const timer = useRef<NodeJS.Timer | null>();
    const savedFunc = useRef<F | null>(func);

    useEffect(() => {
        savedFunc.current = func;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [waitFor]);

    return useCallback((...args: any) => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }

        timer.current = setTimeout(() => savedFunc.current?.(...args), waitFor);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) as (...args: Parameters<F>) => ReturnType<F>;
};


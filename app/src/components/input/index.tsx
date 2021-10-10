import { useRef, useEffect, useCallback, useState } from 'react';
import './input.scss'

export function Input(props: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type: "text" | "number"
}) {
    const [value, setValue] = useState(props.value)

    const debounce = useDebounce((newValue: string) => {
        props.onChange(newValue)
    }, 1000)

    return <input className={'input'}
        value={value}
        type={props.type}
        onChange={(e) => {
            setValue(e.target.value)
            debounce(e.target.value)
            e.preventDefault();
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
    }, [waitFor]);

    return useCallback((...args: any) => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }

        timer.current = setTimeout(() => savedFunc.current?.(...args), waitFor);
    }, []) as (...args: Parameters<F>) => ReturnType<F>;
};


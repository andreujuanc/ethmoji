import './input.scss'

export function Input(props: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type: "text" | "number"
}) {
    return <input className={'input'}
        value={props.value}
        type={props.type}
        onChange={(e) => {
            e.preventDefault();
            props.onChange(e.target.value);
        }} placeholder={props.placeholder} />;
}

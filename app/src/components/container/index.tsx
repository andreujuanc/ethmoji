import './index.scss'

export default function Container({ children, style }: { style?: React.CSSProperties, children: any }) {
    return (
        <div className={"container"}
        style={style}
        >
            {children}
        </div>
    )
}
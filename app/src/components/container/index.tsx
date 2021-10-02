import './index.scss'

export default function Container({ children }: { children: any }) {
    return (
        <div className={"container"} >
            {children}
        </div>
    )
}
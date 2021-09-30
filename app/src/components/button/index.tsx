import { useState } from 'react'
import './index.scss'

type ButtonProps = {
    children: any
    onClick: () => void | Promise<void>
    disabled?: boolean
}

export default function Button(props: ButtonProps) {
    const [clicking, setClicking] = useState(false)

    const onClick = async () => {
        if (clicking || props.disabled) return
        setClicking(true)
        try {
            const result = props.onClick()
            if (result && typeof result.then === 'function') {
                await result
            }
            setClicking(false)
        } catch (ex: any) {
            setClicking(false)
            throw ex
        }

    }

    return (
        <button disabled={props.disabled} className="button" onClick={onClick}>
            {props.children}
        </button>
    )
}
import { Message, useMessages } from "../../hooks/useMessages"

type MessageProps = {
    value: Message
}
export function MessageContainer(props: MessageProps) {
    const { dismissMessage } = useMessages()

    return (
        <div className={`message-item ${props.value.type === 'ERROR' ? 'error' : 'info'}`}>
            <div className="message-icon">
                {props.value.icon}
            </div>
            <div className="message-body">
                {props.value?.message}
            </div>
            <div className="message-dismiss" onClick={() => dismissMessage(props.value.index)}>
                X
            </div>
        </div>
    )
}
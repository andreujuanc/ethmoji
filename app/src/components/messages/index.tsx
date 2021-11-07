import { useMessages, Message } from "../../hooks/useMessages";
import { MessageContainer } from './message'

import './index.scss'

export function Messages() {
    const { messages } = useMessages()

    return (
        <div className="messages-container">
            {messages?.map((x: Message, index: number) => <MessageContainer key={index} value={x} />)}
        </div>
    )
}
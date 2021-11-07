import { createContext, useMemo, useState } from "react"
import { Message } from "../hooks/useMessages"


const initialState: {
    messages: Message[],
    addMessage: (messages: Message) => void
    removeMessage: (index: number) => void
} = {
    addMessage: (messages: Message) => { },
    removeMessage: (index: number) => { },
    messages: []
}

export const MessagesContext = createContext(initialState)

export function MessagesProvider({ children }: any) {
    const [messages, setMessages] = useState<Message[]>([])

    const value = useMemo(
        () => ({
            messages,
            addMessage: (message: Message) => {
                setMessages([...messages, message])
            },
            removeMessage: (index: number) => {
                console.log('index', index)
                console.log('messages', messages)
                setMessages([...messages.filter(x => x.index !== index)])
            }
        }),
        [messages, setMessages]
    );

    return (
        <MessagesContext.Provider value={value}>
            {children}
        </MessagesContext.Provider>
    )
}
import { useContext } from "react"
import { MessagesContext } from "../contexts/messages"

export type Message = {
    index: number
    message: string
    type: 'SUCCESS' | 'ERROR'
    icon: string
}


type Web3Error = Error & {
    data?: {
        message?: string
    }
}

const EVM_ERROR = "Error: VM Exception while processing transaction: reverted with reason string "

export const useMessages = () => {
    const { messages, addMessage, removeMessage } = useContext(MessagesContext)

    const addException = (ex: Web3Error) => {
        let messageText = ex.data?.message ? ex.data.message : ex.message
        if (messageText.startsWith(EVM_ERROR)) {
            messageText = messageText.substr(EVM_ERROR.length)
        }

        messageText = messageText.trim()

        if (messageText.startsWith('') && messageText.endsWith('')) {
            messageText = messageText.substr(0, messageText.length - 1).substr(1)
        }

        addMessage({
            index: messages.length,
            message: messageText,
            type: 'ERROR',
            icon: 'ಥ_ಥ'
        })
    }

    const dismissMessage = (index: number) => {
        removeMessage(index)
    }

    return {
        messages,
        addException,
        dismissMessage
    }
}

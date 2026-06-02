export interface SendSmsRequest {
    sender?: string
    destination: string
    text: string
}

export interface SendSmsResponse {
    message_id: string
    template_resourse_id: string
}
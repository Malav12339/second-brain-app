interface InputProps {
    onChange?: () => void, 
    placeholder: string,
    reference?: any
    type?: string
}

export function Input({ onChange, placeholder, reference, type}: InputProps) {
    return <div>
        <input ref={reference} type={type || "text"} placeholder={placeholder} className="px-4 py-2 border rounded m-2"
        onChange={onChange} />
    </div>
}
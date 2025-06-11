interface InputProps {
    onChange?: () => void, 
    placeholder: string,
    reference?: any
}

export function Input({ onChange, placeholder, reference}: InputProps) {
    return <div>
        <input ref={reference} type="text" placeholder={placeholder} className="px-4 py-2 border rounded m-2"
        onChange={onChange} />
    </div>
}
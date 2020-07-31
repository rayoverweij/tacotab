import React, { useState, ChangeEvent, KeyboardEvent } from 'react';


type EditTextProps = {
    name: string,
    init: string,
    cols?: number,
    maxLength?: number,
    placeholder?: string,
    fn: (name: string, value: string, baggage?: any) => void,
    baggage?: any
}

export const EditText = ({name, init, cols, maxLength, placeholder, fn, baggage}: EditTextProps) => {
    const [value, setValue] = useState(init);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
    }

    const handleLoseFocus = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.which === 13) (event.target as HTMLTextAreaElement).blur();
    }

    const handleSubmit = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        fn(name, value, baggage);
    }

    return (
        <textarea
            className="editText"
            name={name}
            rows={1}
            cols={cols || (value.length > 8 ? value.length : 8)}
            maxLength={maxLength}
            value={value}
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder || name}
            onChange={handleChange}
            onKeyDown={handleLoseFocus}
            onBlur={handleSubmit}
        />
    );
}
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';


type EditTextProps = {
    name: string,
    init: string,
    cols: number | "auto",
    placeholder?: string,
    fn: (name: string, value: string) => void
}

export const EditText = ({name, init, cols, placeholder, fn}: EditTextProps) => {
    const [value, setValue] = useState(init);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
    }

    const handleLoseFocus = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.which === 13) (event.target as HTMLTextAreaElement).blur();
    }

    const handleSubmit = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        fn(name, value);
    }

    return (
        <textarea
            className="editText"
            name={name}
            rows={1}
            cols={cols === "auto" ? (value.length > 8 ? value.length : 8) : cols}
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
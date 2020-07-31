import React, { useState, ChangeEvent } from 'react';
import Form from 'react-bootstrap/Form';


type ToggleProps = {
    id: number,
    name: string,
    init: boolean,
    fn: (name: string, on: boolean) => void
}

export const Toggle = ({id, name, init, fn}: ToggleProps) => {
    const [on, setOn] = useState(init);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setOn(event.target.checked);
        fn(name, !on); // I have *no idea* why this can't just be fn(name, on) but here we are
    }

    return (
        <Form.Check
            id={`toggle-${name}-${id}`}
            className={on ? "on" : "off"}
            name={name}
            type="switch"
            label=""
            checked={on}
            onChange={handleChange} />
    );
}
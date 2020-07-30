import React, { useState } from 'react';
import { Trash, TrashFill } from 'react-bootstrap-icons';

export const TrashButton = () => {
    const [filled, setFilled] = useState(false);

    return (
        <>
            {filled ? 
                <TrashFill
                    role="button"
                    className="icon red"
                    onMouseLeave={() => setFilled(false)} />
                :
                <Trash
                    role="button"
                    className="icon"
                    onMouseEnter={() => setFilled(true)} />
            }
        </>
    );
}
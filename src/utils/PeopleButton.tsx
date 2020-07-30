import React, { useState } from 'react';
import { People, PeopleFill } from 'react-bootstrap-icons';

export const PeopleButton = () => {
    const [filled, setFilled] = useState(false);

    return (
        <>
            {filled ? 
                <PeopleFill
                    role="button"
                    className="icon"
                    onMouseLeave={() => setFilled(false)} />
                :
                <People
                    role="button"
                    className="icon"
                    onMouseEnter={() => setFilled(true)} />
            }
        </>
    );
}
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


type InfoTipProps = {
    id: string,
    abbr: string,
    children: React.ReactNode
}

const InfoTip = ({id, abbr, children}: InfoTipProps) => {
    return (
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip id={id}>
                    {children}
                </Tooltip>
            }
            >
            <abbr title="" tabIndex={0}>{abbr}</abbr>
        </OverlayTrigger>
    )
}

export default InfoTip;
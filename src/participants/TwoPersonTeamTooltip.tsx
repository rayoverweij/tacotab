import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { InfoCircle } from 'react-bootstrap-icons';

class TwoPersonTeamTooltip extends React.Component {
    render() {
        return (
            <OverlayTrigger
                placement="top"
                overlay={
                    <Popover className="popover-explainer" id="tooltip-totalspeakerpoints">
                        <Popover.Content>
                            There are two ways to handle two-person teams. When choosing "averaged third speaker",
                            the points and ranks for both speakers will be averaged. If instead you want the speeches
                            of one team member to count double, create a new "ghost" speaker in the Speakers tab,
                            disqualify them, and add them here.
                        </Popover.Content>
                    </Popover>
                }>    
                <InfoCircle className="icon-info" />
            </OverlayTrigger>
        );
    }
}

export default TwoPersonTeamTooltip;
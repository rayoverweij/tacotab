import React from 'react';
import { Speaker } from '../types/Speaker';

type SpeakerDropDownProps = {
    speakers: Speaker[]
}

export const SpeakerDropDown = ({speakers}: SpeakerDropDownProps) => <>
    {
        speakers.map(speaker => {
            return (
                <option value={speaker.speakerID} key={`option-${speaker.speakerID}`}>{speaker.name}</option>
            );
        })
    }
</>
import pkg from '../../package.json';
const s = JSON.stringify;

export const importTournament = (files: FileList) => {
    if(files.length <= 0) return false;

    const fr = new FileReader();
    fr.onload = event => {
        const result = JSON.parse(event.target!.result as string);

        // CHECK IF PROPER TOURNAMENT EXPORT
        if(!("init" in result)
            || !(("tournamentName" in result) || ("tournament_name" in result))
            || !("config" in result)
            || !(("speakersOne" in result) || ("speakers_one" in result))
            || !(("speakersTwo" in result) || ("speakers_two" in result))
            || !(("teamsOne" in result) || ("teams_one" in result))
            || !(("teamsTwo" in result) || ("teams_two" in result))
            || !(("speakerCounter" in result) || ("speakers_counter" in result))
            || !("judges" in result)
            || !(("judgeCounter" in result) || ("judges_counter" in result))
            || !("draws" in result))
            {
                return false;
            }

        localStorage.setItem("init", s(result.init));
        // COMPATIBILITY WITH EXPORTS BEFORE VERSION 0.3.0
        if(!result.config.version) {
            localStorage.setItem("tournamentName", s(result.tournament_name));

            let importConfig = result.config;
            importConfig.version = pkg.version;
            if(importConfig.divisions === "1") {
                importConfig.numDivisions = 1
            } else {
                importConfig.numDivisions = 2
            }
            delete importConfig.divisions
            localStorage.setItem("config", s(importConfig));

            let importSpeakersOne = result.speakers_one.map((speaker: any) => {
                let newSpeaker = {
                    ...speaker,
                    speakerID: speaker.debaterID
                }
                delete newSpeaker.debaterID
                return newSpeaker
            });
            localStorage.setItem("speakersOne", s(importSpeakersOne));

            let importTeamsOne = result.teams_one.map((team: any) => {
                let newTeam = {
                    ...team,
                    name: team.teamName,
                    round1: team.round1.map((sp: string) => parseInt(sp)),
                    round2: team.round2.map((sp: string) => parseInt(sp)),
                    round3: team.round2.map((sp: string) => parseInt(sp))
                }
                delete newTeam.teamName
                delete newTeam.sideR1
                return newTeam
            });
            localStorage.setItem("teamsOne", s(importTeamsOne));

            let importSpeakersTwo = result.speakers_two.map((speaker: any) => {
                let newSpeaker = {
                    ...speaker,
                    speakerID: speaker.debaterID
                }
                delete newSpeaker.debaterID
                return newSpeaker
            });
            localStorage.setItem("speakersTwo", s(importSpeakersTwo));

            let importTeamsTwo = result.teams_two.map((team: any) => {
                let newTeam = {
                    ...team,
                    name: team.teamName,
                    round1: team.round1.map((sp: string) => parseInt(sp)),
                    round2: team.round2.map((sp: string) => parseInt(sp)),
                    round3: team.round2.map((sp: string) => parseInt(sp))
                }
                delete newTeam.teamName
                delete newTeam.sideR1
                return newTeam
            });
            localStorage.setItem("teamsTwo", s(importTeamsTwo));

            localStorage.setItem("speakerCounter", s(result.speakers_counter));
            localStorage.setItem("teamCounter", s(result.teams_counter));

            let importJudges = result.judges.map((judge: any) => {
                let newJudge = {
                    ...judge,
                    atRound1: judge.r1,
                    atRound2: judge.r2,
                    atRound3: judge.r3
                }
                delete newJudge.r1
                delete newJudge.r2
                delete newJudge.r3
                return newJudge
            });
            localStorage.setItem("judges", s(importJudges));

            localStorage.setItem("judgeCounter", s(result.judges_counter));

            let roomCounter = 0;
            let importDraws = result.draws.map((draw: any) => {
                let newDraw = {
                    ...draw,
                    roomsOne: draw.pairings_one.map((pairing: any) => {
                        let newRoom = {
                            ...pairing,
                            roomID: roomCounter++,
                            name: pairing.room
                        }
                        delete newRoom.room
                        return newRoom
                    }),
                    roomsTwo: draw.pairings_two.map((pairing: any) => {
                        let newRoom = {
                            ...pairing,
                            roomID: roomCounter++,
                            name: pairing.room
                        }
                        delete newRoom.room
                        return newRoom
                    })
                }
                delete newDraw.pairings_one
                delete newDraw.pairings_two
                return newDraw
            });
            localStorage.setItem("draws", s(importDraws));
            localStorage.setItem("roomCounter", s(roomCounter));

        // CURRENT EXPORTS
        } else {
            localStorage.setItem("tournamentName", s(result.tournamentName));
            localStorage.setItem("config", s(result.config));
            localStorage.setItem("speakersOne", s(result.speakersOne));
            localStorage.setItem("teamsOne", s(result.teamsOne));
            localStorage.setItem("speakersTwo", s(result.speakersTwo));
            localStorage.setItem("teamsTwo", s(result.teamsTwo));
            localStorage.setItem("speakerCounter", s(result.speakerCounter));
            localStorage.setItem("teamCounter", s(result.teamCounter));
            localStorage.setItem("judges", s(result.judges));
            localStorage.setItem("judgeCounter", s(result.judgeCounter));
            localStorage.setItem("draws", s(result.draws));
            localStorage.setItem("roomCounter", s(result.roomCounter));
        }

    }
    fr.readAsText(files.item(0) as File);

    window.location.reload();
}
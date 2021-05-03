import Head from 'next/head'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import getBattleReport, { BattleReport } from '../core'
import { createParticipant, Participant } from '../core/battleSetup'
import { Race } from '../core/races/race'
import { UnitType } from '../core/unit'
import { objectKeys } from '../util/util-object'

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > * {
    width: 400px;
  }
`

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;

  > * {
  }
`

const BattleReportDiv = styled.div`
  display: flex;

  > * {
    flex: 1 0 0;
  }
`

export default function Home() {
  const [participantLeft, setParticipantLeft] = useState<Participant>(createParticipant())
  const [participantRight, setParticipantRight] = useState<Participant>(createParticipant())
  const [battleReport, setBattleReport] = useState<BattleReport>()

  const launch = () => {
    const br = getBattleReport(participantLeft, participantRight)
    setBattleReport(br)
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StyledMain>
        <h1>ti4 calc</h1>
        <div style={{ display: 'flex' }}>
          <ParticipantView participant={participantLeft} onChange={setParticipantLeft} />
          <StyledDiv>
            <div>race</div>
            <div>cruiser</div>
            <div>destroyer</div>
          </StyledDiv>
          <ParticipantView participant={participantRight} onChange={setParticipantRight} />
        </div>
        <button onClick={launch}>roll</button>
        {battleReport && (
          <BattleReportDiv>
            <div>{battleReport.left}</div>
            <div>{battleReport.draw}</div>
            <div>{battleReport.right}</div>
          </BattleReportDiv>
        )}
      </StyledMain>
    </div>
  )
}

interface ParticipantProps {
  participant: Participant
  onChange: (participant: Participant) => void
}

function ParticipantView({ participant, onChange }: ParticipantProps) {
  const updateUnitCount = (unitType: UnitType, e: ChangeEvent<HTMLInputElement>) => {
    const newParticipant: Participant = {
      ...participant,
      units: {
        ...participant.units,
        [unitType]: parseInt(e.target.value, 10),
      },
    }
    onChange(newParticipant)
  }

  return (
    <StyledDiv>
      <select
        name="pets"
        onChange={(e) => {
          const race = e.target.value as 'arborec' //  TODO ugly enum type hack
          const newParticipant: Participant = {
            ...participant,
            race: Race[race],
          }
          onChange(newParticipant)
        }}
      >
        {objectKeys(Race).map((race) => {
          return (
            <option key={race} value={race}>
              {Race[race]}
            </option>
          )
        })}
      </select>
      <input
        type="number"
        min="0"
        max="100"
        value={participant.units.cruiser}
        onChange={(e) => {
          updateUnitCount(UnitType.cruiser, e)
        }}
      />
      <input
        type="number"
        min="0"
        max="100"
        value={participant.units.destroyer}
        onChange={(e) => {
          updateUnitCount(UnitType.destroyer, e)
        }}
      />
    </StyledDiv>
  )
}

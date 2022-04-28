import { destroyUnit } from '../battle'
import { BattleInstance, ParticipantInstance } from '../battle-types'
import { BattleEffect, registerUse } from '../battleeffect/battleEffects'
import { LOG } from '../constant'
import { Faction, Place } from '../enums'
import { UnitInstance, UnitType, createUnitAndApplyEffects, defaultRoll } from '../unit'

export const yin: BattleEffect[] = [
  {
    type: 'faction',
    name: 'Yin flagship',
    place: Place.space,
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.flagship) {
        return {
          ...unit,
          combat: {
            ...defaultRoll,
            hit: 9,
            count: 2,
          },
          battleEffects: [
            {
              name: 'Yin flagship "kill everything" effect',
              type: 'other',
              place: Place.space,
              onDeath: (
                deadUnits: UnitInstance[],
                participant: ParticipantInstance,
                otherParticipant: ParticipantInstance,
                _battle: BattleInstance,
                isOwnUnit: boolean,
              ) => {
                if (isOwnUnit && deadUnits.some((u) => u.type === UnitType.flagship)) {
                  participant.units.forEach((u) => (u.isDestroyed = true))
                  otherParticipant.units.forEach((u) => (u.isDestroyed = true))
                }
              },
            },
          ],
        }
      } else {
        return unit
      }
    },
  },
  {
    name: 'Devotion',
    description:
      "After each space battle round, you may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit and assign it to 1 of your opponent's ships in that system.",
    type: 'faction-ability',
    place: Place.space,
    faction: Faction.yin,
    onCombatRoundEnd: (
      participant: ParticipantInstance,
      battle: BattleInstance,
      otherParticipant: ParticipantInstance,
    ) => {
      let suicideUnit = participant.units.find((u) => u.type === UnitType.destroyer)
      if (!suicideUnit) {
        suicideUnit = participant.units.find((u) => u.type === UnitType.cruiser)
      }
      if (suicideUnit) {
        destroyUnit(battle, suicideUnit)
        otherParticipant.hitsToAssign.hitsAssignedByEnemy += 1
        if (LOG) {
          console.log(`${participant.side} uses devotion to destroy their own ${suicideUnit.type}`)
        }
      }
    },
  },
  {
    name: 'Impulse Core',
    description:
      "At the start of a space combat, you may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit against your opponent's ships; that hit must be assigned by your opponent to 1 of their non-fighters ships if able.",
    type: 'faction-tech',
    place: Place.space,
    faction: Faction.yin,
    onStart: (
      participant: ParticipantInstance,
      battle: BattleInstance,
      otherParticipant: ParticipantInstance,
    ) => {
      let suicideUnit = participant.units.find((u) => u.type === UnitType.destroyer)
      if (!suicideUnit) {
        suicideUnit = participant.units.find((u) => u.type === UnitType.cruiser)
      }
      if (suicideUnit) {
        destroyUnit(battle, suicideUnit)
        otherParticipant.hitsToAssign.hitsToNonFighters += 1
      }
    },
  },
  {
    name: 'Yin agent',
    description:
      "After a player's unit is destroyed: You may exhaust this card to allow that player to place 2 fighters in the destroyed unit's system if it was a ship, or 2 infantry on its planet if it was a ground force.",
    type: 'agent',
    place: 'both',
    onDeath: (
      _deadUnits: UnitInstance[],
      participant: ParticipantInstance,
      _otherParticipant: ParticipantInstance,
      battle: BattleInstance,
      isOwnUnit: boolean,
      effectName: string,
    ) => {
      if (!isOwnUnit) {
        return
      }
      if (battle.place === Place.space) {
        const newFigher1 = createUnitAndApplyEffects(UnitType.fighter, participant, battle.place)
        const newFigher2 = createUnitAndApplyEffects(UnitType.fighter, participant, battle.place)
        participant.newUnits.push(newFigher1)
        participant.newUnits.push(newFigher2)
        if (LOG) {
          console.log(
            `${participant.side} uses Yin agent to summon two fighters when a unit was destroyed`,
          )
        }
      } else {
        const newInfantry1 = createUnitAndApplyEffects(UnitType.infantry, participant, battle.place)
        const newInfantry2 = createUnitAndApplyEffects(UnitType.infantry, participant, battle.place)
        participant.newUnits.push(newInfantry1)
        participant.newUnits.push(newInfantry2)
        if (LOG) {
          console.log(
            `${participant.side} uses Yin agent to summon two infantry when a unit was destroyed`,
          )
        }
      }
      registerUse(effectName, participant)
    },
    timesPerFight: 1,
  },
]

import { ParticipantInstance, BattleInstance } from '../battle-types'
import { BattleEffect } from '../battleeffect/battleEffects'
import { Place, Race } from '../enums'
import { getHits } from '../roll'
import { defaultRoll, UnitInstance, UnitType } from '../unit'
import { createUnitAndApplyEffects } from '../battleSetup'

export const mentak: BattleEffect[] = [
  {
    type: 'race',
    name: 'Mentak flagship',
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.flagship) {
        return {
          ...unit,
          combat: {
            ...defaultRoll,
            hit: 7,
            count: 2,
          },
          aura: [
            {
              name: 'Mentak flagship ability',
              type: 'other',
              place: Place.space,
              transformEnemyUnit: (u: UnitInstance) => {
                // TODO preventing enemy sustain damage needs to be like a flag of its own, since it plays out during "assign hit"-step
                // TODO test all auras that affects enemies
                // TODO test this ship with assault cannon. It should snipe the ship and retain sustain damage
                if (u.isShip) {
                  return {
                    ...u,
                    sustainDamage: false,
                  }
                } else {
                  return u
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
    name: 'Mentak mech',
    type: 'race',
    transformUnit: (u: UnitInstance) => {
      if (u.type === UnitType.mech) {
        return {
          ...u,
          aura: [
            {
              name: 'Mentak mech ability',
              type: 'other',
              place: Place.space,
              transformEnemyUnit: (u: UnitInstance) => {
                if (u.isGroundForce) {
                  return {
                    ...u,
                    sustainDamage: false,
                  }
                } else {
                  return u
                }
              },
            },
          ],
        }
      } else {
        return u
      }
    },
  },
  {
    name: 'Ambush',
    type: 'race',
    onStart: (
      participant: ParticipantInstance,
      _battle: BattleInstance,
      otherParticipant: ParticipantInstance,
    ) => {
      const cruisers = participant.units.filter((u) => u.type === UnitType.cruiser).slice(0, 2)
      const destroyers = participant.units
        .filter((u) => u.type === UnitType.destroyer)
        .slice(0, 2 - cruisers.length)

      const ambushShips = [...cruisers, ...destroyers]

      let hits = 0
      for (const ambushShip of ambushShips) {
        const hit = getHits({
          ...defaultRoll,
          hit: ambushShip.combat!.hit,
        })
        hits += hit.hits
      }
      otherParticipant.hitsToAssign.hits += hits
    },
  },
  {
    name: 'Mentak hero',
    type: 'race-tech',
    race: Race.mentak,
    onDeath: (
      deadUnits: UnitInstance[],
      participant: ParticipantInstance,
      _otherParticipant: ParticipantInstance,
      battle: BattleInstance,
      isOwnUnit: boolean,
    ) => {
      if (isOwnUnit) {
        return
      }

      for (const rawUnit of deadUnits) {
        const unit = createUnitAndApplyEffects(rawUnit.type, participant, battle.place)
        participant.newUnits.push(unit)
      }
    },
  },
]
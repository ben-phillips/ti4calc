import { doBombardment } from '../battle'
import { ParticipantInstance, BattleInstance } from '../battle-types'
import { BattleEffect } from '../battleeffect/battleEffects'
import { Race } from '../enums'
import { defaultRoll, UnitInstance, UnitType } from '../unit'

export const l1z1x: BattleEffect[] = [
  {
    type: 'race',
    name: 'L1z1x flagship',
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.flagship) {
        return {
          ...unit,
          combat: {
            ...defaultRoll,
            hit: 5,
            count: 2,
          },

          aura: [
            {
              name: 'L1z1x flagship forcing shots on non-fighters',
              transformUnit: (unit: UnitInstance) => {
                if (unit.type === UnitType.flagship || unit.type === UnitType.dreadnought) {
                  return {
                    ...unit,
                    assignHitsToNonFighters: true,
                  }
                } else {
                  return unit
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
    type: 'race',
    name: 'L1z1x Harrow',
    onCombatRoundEnd: (
      participant: ParticipantInstance,
      battle: BattleInstance,
      _otherParticipant: ParticipantInstance,
    ) => {
      if (participant.side === 'attacker') {
        doBombardment(battle)
      }
    },
  },
  {
    type: 'race-tech',
    name: 'L1z1x dreadnaught upgrade',
    race: Race.l1z1x,
    unit: UnitType.dreadnought,
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.dreadnought) {
        return {
          ...unit,
          combat: {
            ...unit.combat!,
            hit: 4,
          },
        }
      } else {
        return unit
      }
    },
  },
]
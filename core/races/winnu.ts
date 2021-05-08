import { BattleInstance, ParticipantInstance } from '../battle-types'
import { BattleEffect } from '../battleeffect/battleEffects'
import { defaultRoll, getNonFighterShips, UnitInstance, UnitType } from '../unit'

export const winnu: BattleEffect[] = [
  {
    type: 'race',
    name: 'Winnu flagship',
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.flagship) {
        return {
          ...unit,
          combat: {
            ...defaultRoll,
            hit: 7,
            count: 1,
          },
          aura: [
            {
              name: 'Winnu Flagship ability',
              type: 'other',
              transformUnit: (
                unit: UnitInstance,
                p: ParticipantInstance,
                battle: BattleInstance,
              ) => {
                if (unit.type === UnitType.flagship) {
                  const opponent = p.side === 'attacker' ? battle.defender : battle.attacker
                  const nonFighterShips = getNonFighterShips(opponent)
                  return {
                    ...unit,
                    combat: {
                      ...unit.combat!,
                      count: nonFighterShips.length,
                    },
                  }
                }
                return unit
              },
            },
          ],
        }
      } else {
        return unit
      }
    },
  },
]
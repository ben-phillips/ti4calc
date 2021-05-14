import { BattleEffect } from '../battleeffect/battleEffects'
import { defaultRoll, UnitInstance, UnitType } from '../unit'

export const yssaril: BattleEffect[] = [
  {
    type: 'race',
    name: 'Yssaril flagship',
    transformUnit: (unit: UnitInstance) => {
      if (unit.type === UnitType.flagship) {
        return {
          ...unit,
          combat: {
            ...defaultRoll,
            hit: 5,
            count: 2,
          },
        }
      } else {
        return unit
      }
    },
  },
]
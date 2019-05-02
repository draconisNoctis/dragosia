import { Injectable } from '@angular/core';
import { IArmorValues, IArmor } from '@jina-draicana/presets';

const HEAD_FACTOR = 2;
const CHEST_BACK_FACTOR = 5;
const ARM_LEG_FACTOR = 4;
const DIVIDER = 28;

@Injectable({
    providedIn: 'root'
})
export class ArmorService {

    constructor() { }

    aggregateArmor(armors : IArmor[]) : IArmorValues {
        return armors.reduce((t, c) => {
            t.head += c.head;
            t.chest += c.chest;
            t.back += c.back;
            t.leftArm += c.leftArm;
            t.rightArm += c.rightArm;
            t.leftLeg += c.leftLeg;
            t.rightLeg += c.rightLeg;

            return t;
        }, {
            head: 0,
            chest: 0,
            back: 0,
            leftArm: 0,
            rightArm: 0,
            leftLeg: 0,
            rightLeg: 0
        })
    }

    getTotalArmor(values: IArmorValues, { precise = false }: { precise?: boolean } = {}) {
        const vHead = values.head * HEAD_FACTOR;
        const vChest = values.chest * CHEST_BACK_FACTOR;
        const vBack = values.back * CHEST_BACK_FACTOR;
        const vLeftArm = values.leftArm * ARM_LEG_FACTOR;
        const vRightArm = values.rightArm * ARM_LEG_FACTOR;
        const vLeftLeg = values.leftLeg * ARM_LEG_FACTOR;
        const vRightLeg = values.rightLeg * ARM_LEG_FACTOR;

        const vTotal = vHead + vChest + vBack + vLeftArm + vRightArm + vLeftLeg + vRightLeg;

        if (precise) {
            return vTotal / DIVIDER;
        } else {
            return Math.round(vTotal / DIVIDER);
        }
    }
}

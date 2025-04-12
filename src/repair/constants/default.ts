import { Repair, RepairOption } from '@prisma/client'

type IRepair = Pick<Repair, 'option'> &
    Partial<Pick<Repair, 'mileage' | 'days'>>
type IRepairReturn = IRepair & Pick<Repair, 'isDefault' | 'isVisible'>

const baseDefaultRepair: IRepair[] = [
    {
        option: RepairOption.engine_oil,
        mileage: 10_000,
        days: 365
    },
    {
        option: RepairOption.transmission_oil,
        mileage: 10_000,
        days: 365
    },
    {
        option: RepairOption.oil_filter,
        mileage: 10_000
    },
    {
        option: RepairOption.air_filter,
        mileage: 10_000
    },
    {
        option: RepairOption.cabin_filter,
        mileage: 10_000
    },
    {
        option: RepairOption.front_brake_pads,
        mileage: 30_000,
        days: 730
    },
    {
        option: RepairOption.rear_brake_pads,
        mileage: 50_000,
        days: 1_095
    },
    {
        option: RepairOption.brake_fluid,
        days: 730
    },
    {
        option: RepairOption.front_brake_discs,
        mileage: 50_000,
        days: 730
    },
    {
        option: RepairOption.rear_brake_discs,
        mileage: 60_000,
        days: 1_095
    },
    {
        option: RepairOption.air_conditioner_refill,
        mileage: 75_000
    },
    {
        option: RepairOption.spark_plugs,
        mileage: 25_000
    },
    {
        option: RepairOption.coolant,
        days: 730
    },
    {
        option: RepairOption.alignment
    },
    {
        option: RepairOption.timing_belt,
        mileage: 60_000
    },
    {
        option: RepairOption.fuel_filter,
        mileage: 15_000
    },
    {
        option: RepairOption.transfer_case_oil,
        mileage: 10_000
    },
    {
        option: RepairOption.differential_oil,
        mileage: 10_000
    },
    {
        option: RepairOption.car_battery,
        mileage: 10_000
    },
    {
        option: RepairOption.power_steering_fluid,
        mileage: 10_000
    },
    {
        option: RepairOption.clutch,
        mileage: 50_000
    }
]

export const defaultRepair: IRepairReturn[] = baseDefaultRepair.map(repair => ({
    ...repair,
    isDefault: true,
    isVisible: true
}))

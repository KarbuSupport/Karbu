export interface VehicleData {
  id?: number
  brand: string
  model: string
  year: number
  engineType: string
  transmission: string
  licensePlate?: string
  engineNumber?: string
  vin?: string
}

export interface VehicleCheckData {
  oilLevel?: string | null
  temperatureLevel?: string | null
  fuelLevel?: string | null
  batteryType?: string | null
  batteryBrand?: string | null
  batteryStatus?: string | null
  scratches?: string | null
  dents?: string | null
  collisions?: string | null
  windshieldStatus?: string | null
  glassStatus?: string | null
  engineOil?: string | null
  transmissionOil?: string | null
  steeringOil?: string | null
  brakeFluid?: string | null
  wiperFluid?: string | null
  frontTires?: string | null
  frontBrakes?: string | null
  rearTires?: string | null
  rearBrakes?: string | null
  leakInspection?: string | null
  brakeSystem?: string | null
  engineSystem?: string | null
  engineCoolingSystem?: string | null
  transmissionCoolingSystem?: string | null
  shockAbsorbers?: string | null
  belts?: string | null
  hoses?: string | null
  airFilter?: string | null
  steeringMechanism?: string | null
  dustCoverArrows?: string | null
  exhaustSystem?: string | null
  steeringRod?: string | null
  suspensionBushings?: string | null
  bearings?: string | null
}


export interface VehicleServiceData {
basicMaintenance: boolean
preventiveMaintenance: boolean
electronicDiagnostics: boolean
fuelSystemService: boolean
coolingSystemService: boolean
brakeService: boolean
suspensionAndSteering: boolean
generalMechanics: boolean
electricalSystem: boolean
generalInspection: boolean
tripInspection: boolean
emissionsPreparation: boolean
accessoriesInstallation: boolean
repairInsurance: boolean
}

export interface QuoteFormData {
  vehicle: VehicleData
  generalNotes?: string
  repairEstimate?: number
  purchaseCheck: boolean
  fullVisualInspection: boolean
  chassisReview?: string
  visibleDamages?: string
  vehicleCheck?: VehicleCheckData
  vehicleService?: VehicleServiceData
}

export interface QuoteWithRelations {
  id: number
  vehicleId: number
  generalNotes: string | null
  repairEstimate: number | null
  purchaseCheck: boolean
  fullVisualInspection: boolean
  chassisReview: string | null
  visibleDamages: string | null
  createdAt: Date
  vehicle: {
    id: number
    brand: string
    model: string
    year: number
    engineType: string
    transmission: string
    licensePlate: string | null
    engineNumber: string | null
    vin: string | null
  }
  vehicleChecks: VehicleCheckData[]
  vehicleServices: VehicleServiceData[]
}

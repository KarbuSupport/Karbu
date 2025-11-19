import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // =========================
  // ROLES
  // =========================
  const adminRole = await prisma.role.create({ data: { name: "Admin", description: "Administrador del sistema" } });
  // const techRole = await prisma.role.create({ data: { name: "Technician", description: "Técnico del taller" } });
  // const receptionRole = await prisma.role.create({ data: { name: "Receptionist", description: "Recepción y atención" } });

  // =========================
  // PERMISOS
  // =========================
  const allPermissions = [
    "Ver Dashboard",
    "Ver Cotizaciones",
    "Crear Cotizaciones",
    "Editar Cotizaciones",
    "Eliminar Cotizaciones",
    "Ver Contratos",
    "Crear Contratos",
    "Editar Contratos",
    "Eliminar Contratos",
    "Ver Pagos",
    "Crear Pagos",
    "Editar Pagos",
    "Eliminar Pagos",
    "Ver Usuarios",
    "Crear Usuarios",
    "Editar Usuarios",
    "Eliminar Usuarios",
    "Ver Roles y Permisos",
    "Crear Roles y Permisos",
    "Editar Roles y Permisos",
    "Eliminar Roles y Permisos",
    "Busqueda QR",
  ];

  const permissionRecords = await Promise.all(
    allPermissions.map(name => prisma.permission.create({ data: { name } }))
  );

  // =========================
  // ASIGNAR PERMISOS A ROLES
  // =========================
  // Admin: todos los permisos
  await Promise.all(
    permissionRecords.map(p =>
      prisma.rolePermission.create({
        data: { roleId: adminRole.id, permissionId: p.id },
      })
    )
  );
  // =========================
  // USUARIOS
  // =========================

  const saltRounds = 10

  const adminPassword = await bcrypt.hash("adminHector", saltRounds)
  // const techPassword = await bcrypt.hash("tech123", saltRounds)
  // const receptionPassword = await bcrypt.hash("reception123", saltRounds)


  const adminUser = await prisma.user.create({
    data: {
      firstName: "Hector",
      lastName1: "Mendez",
      lastName2: "",
      email: "administrador@karbu.com.mx",
      passwordHash: adminPassword,
      roleId: adminRole.id,
    },
  });

  // const techUser = await prisma.user.create({
  //   data: {
  //     firstName: "Laura",
  //     lastName1: "Rodríguez",
  //     lastName2: "Martínez",
  //     email: "tech@example.com",
  //     passwordHash: techPassword,
  //     roleId: techRole.id,
  //   },
  // });

  // const receptionUser = await prisma.user.create({
  //   data: {
  //     firstName: "Miguel",
  //     lastName1: "Torres",
  //     lastName2: "Hernández",
  //     email: "reception@example.com",
  //     passwordHash: receptionPassword,
  //     roleId: receptionRole.id,
  //   },
  // });

  // =========================
  // VEHÍCULOS
  // =========================
  // const vehicle1 = await prisma.vehicle.create({
  //   data: { brand: "Toyota", model: "Corolla", year: 2020, engineType: "Gasoline", transmission: "Automatic", licensePlate: "ABC-123" },
  // });

  // const vehicle2 = await prisma.vehicle.create({
  //   data: { brand: "Honda", model: "Civic", year: 2018, engineType: "Diesel", transmission: "Manual", licensePlate: "XYZ-789" },
  // });

  // const vehicle3 = await prisma.vehicle.create({
  //   data: { brand: "Ford", model: "Focus", year: 2019, engineType: "Gasoline", transmission: "Automatic", licensePlate: "DEF-456" },
  // });

  // =========================
  // SERVICIOS
  // =========================
  const mantenimientoBasico = await prisma.service.create({
    data: {
      name: "Mantenimiento Básico (aceite, filtros, bujías)",
      basePrice: 500
    }
  });

  const mantenimientoPreventivo = await prisma.service.create({
    data: {
      name: "Mantenimiento Preventivo (limpiezas y ajustes)",
      basePrice: 600
    }
  });

  const diagnosticoElectronico = await prisma.service.create({
    data: {
      name: "Diagnóstico y Escaneo Electrónico",
      basePrice: 450
    }
  });

  const sistemaCombustible = await prisma.service.create({
    data: {
      name: "Servicio al Sistema de Combustible (inyectores, MAF, cuerpo de aceleración)",
      basePrice: 900
    }
  });

  const sistemaEnfriamiento = await prisma.service.create({
    data: {
      name: "Servicio al Sistema de Enfriamiento",
      basePrice: 700
    }
  });

  const sistemaFrenos = await prisma.service.create({
    data: {
      name: "Servicio de Frenos",
      basePrice: 600
    }
  });

  const suspensionDireccion = await prisma.service.create({
    data: {
      name: "Suspensión y Dirección",
      basePrice: 750
    }
  });

  const mecanicaGeneral = await prisma.service.create({
    data: {
      name: "Mecánica General (motor, transmisión, fugas)",
      basePrice: 1200
    }
  });

  const sistemaElectrico = await prisma.service.create({
    data: {
      name: "Sistema Eléctrico",
      basePrice: 800
    }
  });

  const inspeccionGeneral = await prisma.service.create({
    data: {
      name: "Inspección General del Vehículo",
      basePrice: 350
    }
  });

  const revisionPreviaje = await prisma.service.create({
    data: {
      name: "Revisión Previaje / Precompra",
      basePrice: 450
    }
  });

  const verificacionVehicular = await prisma.service.create({
    data: {
      name: "Preparación para Verificación",
      basePrice: 500
    }
  });

  const instalacionAccesorios = await prisma.service.create({
    data: {
      name: "Instalación de Accesorios",
      basePrice: 300
    }
  });

  const seguroReparacion = await prisma.service.create({
    data: {
      name: "Seguro de Reparación",
      basePrice: 0
    }
  });


  // =========================
  // COTIZACIONES
  // =========================
  // const quote1 = await prisma.quote.create({
  //   data: {
  //     vehicleId: vehicle1.id,
  //     generalNotes: "Revisión general",
  //     repairEstimate: 1200,
  //     purchaseCheck: true,
  //     fullVisualInspection: true,
  //     chassisReview: "Sin daños",
  //     visibleDamages: "Pequeños raspones",
  //     vehicleChecks: {
  //       create: [
  //         {
  //           oilLevel: "OK",
  //           temperatureLevel: "OK",
  //           fuelLevel: "Half",
  //           batteryType: "AGM",
  //           batteryBrand: "Bosch",
  //           batteryStatus: "Good",
  //         },
  //       ],
  //     },
  //     vehicleServices: {
  //       create: [
  //         {
  //           oilChange: true,
  //           tuneUp: false,
  //           airFilterChange: true,
  //           fuelFilterChange: false,
  //           throttleBodyCleaning: false,
  //           iacValveCleaning: false,
  //           mafSensorCleaning: false,
  //           injectorCleaning: false,
  //         },
  //       ],
  //     },
  //   },
  // });

  // const quote2 = await prisma.quote.create({
  //   data: {
  //     vehicleId: vehicle2.id,
  //     generalNotes: "Chequeo previo venta",
  //     repairEstimate: 800,
  //     purchaseCheck: true,
  //     fullVisualInspection: false,
  //     chassisReview: "Pequeñas abolladuras",
  //     visibleDamages: "Golpe en parachoques",
  //     vehicleChecks: {
  //       create: [
  //         {
  //           oilLevel: "Low",
  //           temperatureLevel: "OK",
  //           fuelLevel: "Full",
  //           batteryType: "Lead-Acid",
  //           batteryBrand: "Exide",
  //           batteryStatus: "Fair",
  //         },
  //       ],
  //     },
  //     vehicleServices: {
  //       create: [
  //         {
  //           oilChange: true,
  //           tuneUp: true,
  //           airFilterChange: false,
  //           fuelFilterChange: true,
  //           throttleBodyCleaning: false,
  //           iacValveCleaning: true,
  //           mafSensorCleaning: false,
  //           injectorCleaning: true,
  //         },
  //       ],
  //     },
  //   },
  // });

  // =========================
  // CONTRATOS
  // =========================
  // const contract1 = await prisma.contract.create({
  //   data: {
  //     clientName: "Juan López",
  //     vehicleId: vehicle1.id,
  //     quoteId: quote1.id,
  //     startDate: new Date(),
  //     status: "Active",
  //     responsibleUser: adminUser.id,
  //     qrCode: "asd-34-2",
  //     services: {
  //       create: [
  //         { serviceId: oilChange.id, price: 500 },
  //         { serviceId: tireRotation.id, price: 300 },
  //       ],
  //     },
  //   },
  // });

  // const contract2 = await prisma.contract.create({
  //   data: {
  //     clientName: "Ana Torres",
  //     vehicleId: vehicle2.id,
  //     startDate: new Date(),
  //     status: "Pending",
  //     responsibleUser: techUser.id,
  //     qrCode: "asd-34-2-3",
  //     services: {
  //       create: [
  //         { serviceId: oilChange.id, price: 550 },
  //         { serviceId: tuneUp.id, price: 800 },
  //       ],
  //     },
  //   },
  // });

  // const contract3 = await prisma.contract.create({
  //   data: {
  //     clientName: "Luis Fernández",
  //     vehicleId: vehicle3.id,
  //     quoteId: null, // Contrato sin cotización
  //     startDate: new Date(),
  //     status: "Active",
  //     responsibleUser: receptionUser.id,
  //     qrCode: "asd-34-222",
  //     services: {
  //       create: [{ serviceId: brakeCheck.id, price: 400 }],
  //     },
  //   },
  // });

  // =========================
  // PAGOS
  // =========================
  // await prisma.payment.create({
  //   data: {
  //     contractId: contract1.id,
  //     quoteId: null,
  //     amount: 800,
  //     method: "Cash",
  //     paymentDate: new Date(),
  //     responsibleUser: adminUser.id,
  //   },
  // });

  // await prisma.payment.create({
  //   data: {
  //     contractId: null,
  //     quoteId: quote2.id,
  //     amount: 500,
  //     method: "Card",
  //     paymentDate: new Date(),
  //     responsibleUser: techUser.id,
  //   },
  // });

  // await prisma.payment.create({
  //   data: {
  //     contractId: contract3.id,
  //     quoteId: null,
  //     amount: 400,
  //     method: "Transfer",
  //     paymentDate: new Date(),
  //     responsibleUser: receptionUser.id,
  //   },
  // });

  console.log("✅ Seed completo con múltiples escenarios");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

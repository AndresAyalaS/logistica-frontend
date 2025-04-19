
class MockApi {
  constructor() {
    // Inicializar almacenamiento en localStorage si no existe
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]));
    }
    if (!localStorage.getItem("packages")) {
      localStorage.setItem("packages", JSON.stringify([]));
    }
    if (!localStorage.getItem("shipments")) {
      localStorage.setItem("shipments", JSON.stringify([]));
    }
    if (!localStorage.getItem("shipment_status_history")) {
      localStorage.setItem("shipment_status_history", JSON.stringify([]));
    }
  }

  // Simular delay de red
  async delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Auth endpoints
  async register(userData) {
    await this.delay();

    const users = JSON.parse(localStorage.getItem("users"));

    // Verificar si el email ya existe
    if (users.some((user) => user.email === userData.email)) {
      throw new Error("El correo electrónico ya está registrado");
    }

    // Crear nuevo usuario (simulación de encriptación de contraseña)
    const newUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      password: `encrypted_${userData.password}`, // Simular encriptación
      role: "client",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Guardar usuario
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Retornar usuario sin contraseña
    const { password, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword,
      message: "Usuario registrado correctamente",
    };
  }

  async login(credentials) {
    await this.delay();

    const users = JSON.parse(localStorage.getItem("users"));

    // Buscar usuario por email
    const user = users.find((user) => user.email === credentials.email);

    // Verificar credenciales (simulación de verificación de contraseña)
    if (!user || `encrypted_${credentials.password}` !== user.password) {
      throw new Error("Credenciales inválidas");
    }

    // Generar token JWT simulado
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;

    // Retornar información de usuario y token
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async verifyToken(token) {
    await this.delay();

    // Validar token (muy simplificado)
    if (token && token.startsWith("mock_jwt_token_")) {
      const userId = token.split("_")[2];
      const users = JSON.parse(localStorage.getItem("users"));
      const user = users.find((user) => user.id.toString() === userId);

      if (user) {
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, isValid: true };
      }
    }

    throw new Error("Token inválido o expirado");
  }

  // Shipment endpoints
  async createPackage(packageData) {
    await this.delay();

    const packages = JSON.parse(localStorage.getItem("packages"));

    // Crear nuevo paquete
    const newPackage = {
      id: Date.now(),
      weight: packageData.weight,
      dimensions: packageData.dimensions,
      product_type: packageData.productType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Guardar paquete
    packages.push(newPackage);
    localStorage.setItem("packages", JSON.stringify(packages));

    return newPackage;
  }

  async createShipment(shipmentData, userId) {
    await this.delay();

    // Primero crear el paquete
    const newPackage = await this.createPackage({
      weight: shipmentData.weight,
      dimensions: {
        length: shipmentData.length,
        width: shipmentData.width,
        height: shipmentData.height,
      },
      productType: shipmentData.productType,
    });

    const shipments = JSON.parse(localStorage.getItem("shipments"));

    // Generar número de rastreo único
    const trackingNumber = `TRACK-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;

    // Crear nuevo envío
    const newShipment = {
      id: Date.now(),
      user_id: userId,
      package_id: newPackage.id,
      origin_address: shipmentData.originAddress,
      destination_address: shipmentData.destinationAddress,
      status: "pending", // Estado inicial
      tracking_number: trackingNumber,
      route_id: null, // Aún no asignado
      carrier_id: null, // Aún no asignado
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Guardar envío
    shipments.push(newShipment);
    localStorage.setItem("shipments", JSON.stringify(shipments));

    // Crear historial de estado inicial
    const shipmentStatusHistory = JSON.parse(
      localStorage.getItem("shipment_status_history")
    );
    const statusEntry = {
      id: Date.now(),
      shipment_id: newShipment.id,
      status: "pending",
      notes: "Envío creado, en espera de procesamiento",
      created_at: new Date().toISOString(),
    };

    shipmentStatusHistory.push(statusEntry);
    localStorage.setItem(
      "shipment_status_history",
      JSON.stringify(shipmentStatusHistory)
    );

    return {
      ...newShipment,
      package: newPackage,
      status_history: [statusEntry],
    };
  }

  async getUserShipments(userId) {
    await this.delay();

    const shipments = JSON.parse(localStorage.getItem("shipments"));
    const packages = JSON.parse(localStorage.getItem("packages"));
    const shipmentStatusHistory = JSON.parse(
      localStorage.getItem("shipment_status_history")
    );

    // Filtrar envíos del usuario
    const userShipments = shipments.filter(
      (shipment) => shipment.user_id === userId
    );

    // Agregar información del paquete y el historial de estados
    return userShipments.map((shipment) => {
      const package_info = packages.find(
        (pkg) => pkg.id === shipment.package_id
      );
      const history = shipmentStatusHistory.filter(
        (entry) => entry.shipment_id === shipment.id
      );

      return {
        ...shipment,
        package: package_info,
        status_history: history,
      };
    });
  }

  async validateAddress(address) {
    await this.delay();

    // Simular validación de dirección (muy simplificada)
    if (!address || address.trim().length < 10) {
      return { valid: false, message: "La dirección es demasiado corta" };
    }

    // Aquí podrías agregar más reglas de validación si es necesario

    return { valid: true };
  }
}

export default new MockApi();

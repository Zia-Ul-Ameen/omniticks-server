"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const users_service_1 = require("./users/users.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const adminEmail = 'admin@omnitics.com';
    const adminPassword = 'Admin@123';
    try {
        const existingAdmin = await usersService.findByEmail(adminEmail);
        if (existingAdmin) {
            console.log('Admin user already exists.');
        }
        else {
            await usersService.create({
                email: adminEmail,
                password: adminPassword,
                name: 'Admin User',
                isAdmin: true,
            });
            console.log('Admin user created successfully.');
        }
    }
    catch (error) {
        console.error('Error seeding admin user:', error.message);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map
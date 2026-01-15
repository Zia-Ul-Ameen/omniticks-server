import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@omnitics.com';
  const adminPassword = 'Admin@123';

  try {
    const existingAdmin = await usersService.findByEmail(adminEmail);
    if (existingAdmin) {
      console.log('Admin user already exists.');
    } else {
      await usersService.create({
        email: adminEmail,
        password: adminPassword,
        name: 'Admin User',
        isAdmin: true,
      });
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap();

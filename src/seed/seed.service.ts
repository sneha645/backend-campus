import { Injectable, OnModuleInit } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SetupService implements OnModuleInit {
  constructor(private readonly authService: AuthService) {}

  async onModuleInit() {
    await this.createAdmin();
  }

  async createAdmin() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;

    if (!email || !password || !name) {
      console.warn(
        'Skipping Admin creation: missing ADMIN_EMAIL, ADMIN_PASSWORD, or ADMIN_NAME environment variables.',
      );
      return;
    }

    const existing = await this.authService.findByEmail(email);
    if (existing) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.authService.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    });

    console.log('Admin created successfully');
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from "@nestjs/config";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_SECRET_ID'),
      callbackURL: 'http://localhost:7004/api/v1/auth/google/callback', // Cambia la URL según tu configuración
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    console.log(profile);
    
    const { emails, displayName , photos } = profile;
    const user = {
      email: emails[0].value,
      name: displayName,
      photo: photos[0].value
    };
    done(null, user);
  }
}
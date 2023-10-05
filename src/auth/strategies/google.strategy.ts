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
      callbackURL: `${configService.get('URL_APLICATION')}/login`, 
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string, 
    refreshToken: string, 
    profile: any, 
    done: VerifyCallback
  ): Promise<any> {
    const { emails, displayName, name , photos } = profile;
    
    const user = {
      email: emails[0].value,
      name: displayName,
      nombres:name.givenName,
      apellidos:name.familyName,
      photo: photos[0].value
    };
    const payload = {
      ...user,
      accessToken,
    };
    done(null, payload);
  }
}
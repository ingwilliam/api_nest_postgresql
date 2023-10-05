import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_SECRET_ID'),
      callbackURL: `${configService.get('URL_APLICATION')}/login`,
      scope: 'email',profileFields: ['emails', 'name','picture.type(large)'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails , photos } = profile;
    console.log(profile);
    
    const user = {
      email: emails[0].value,
      name: name.givenName+" "+name.familyName,
      nombres:name.givenName,
      apellidos:name.familyName,
      photo:photos[0].value
    };
    const payload = {
      ...user,
      accessToken,
    };
    done(null, payload);
  }
}
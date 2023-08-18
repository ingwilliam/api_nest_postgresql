import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: 148468471631217,
      clientSecret: "1df5b17428e15b51cadc185b4e7ec4aa",
      callbackURL: 'http://localhost:7004/api/v1/auth/facebook/callback',
      scope: 'email',
      profileFields: ['emails', 'name','picture.type(large)'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails , photos } = profile;

    console.log(photos);
    
    const user = {
      email: emails[0].value,
      name: name.givenName+" "+name.familyName,
      photo:photos[0].value
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}

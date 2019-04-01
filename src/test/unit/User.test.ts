import { expect } from 'chai';

import * as bcrypt from 'bcryptjs';

import { User } from '../../entity/User';

describe('User entity', function() {
  const userData = {
    username: 'admin',
    nonEncryptedPassword: 'admin',
    role: 'ADMIN',
  };

  describe('hashPassword', () => {
    it('should hash the password correctly', async () => {
      const user = new User();
      user.username = userData.username;
      user.password = userData.nonEncryptedPassword;
      user.role = userData.role;

      await user.hashPassword();
      expect(await bcrypt.compare(userData.nonEncryptedPassword, user.password))
        .to.be.true;
      expect(await bcrypt.compare(userData.nonEncryptedPassword, 'badmin')).to
        .be.false;
    });
  });

  describe('isNonEncryptedPasswordValid', async () => {
    const user = new User();
    user.username = userData.username;
    user.password = userData.nonEncryptedPassword;
    user.role = userData.role;

    await user.hashPassword();
    expect(await user.isNonEncryptedPasswordValid('admin')).to.be.true;
    expect(await user.isNonEncryptedPasswordValid('badmin')).to.be.false;
  });
});
